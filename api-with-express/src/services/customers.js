const debug = require('debug')('services');
const { Connection, Statement, } = require('idb-pconnector');
const config = require('config');
const schema = config.get('schema');

module.exports = ({ MissingResourceError, ValidationError, NoDataError }) => {
  return { list, create, find, update, remove };

  async function list(sort) {
    try {
      debug("List customers : %O", sort)   
      const connection = new Connection({ url: '*LOCAL' });
      const statement = new Statement(connection);
      // await statement.exec("SET SCHEMA QIWS") 
      // const sql = `SELECT LSTNAM, CUSNUM FROM QCUSTCDT order by ${sort} ASC`;
      let sql = `SELECT * FROM ${schema}.QCUSTCDT`;
      if (sort) {
        sql += ` order by ${sort}`
      }
      debug("SQL : %O", sql) 
      await statement.prepare(sql);  
      await statement.execute();
      let customers = await statement.fetchAll();
      await statement.close();
      await connection.disconn();
      return customers;

    } catch (errorMessage) {
      throw new MissingResourceError(errorMessage)
    }
  }

  async function create(data) {
    try {
      debug("Create customer : %O", data)      
      const connection = new Connection({ url: '*LOCAL' });
      const statement = new Statement(connection);
      // await statement.exec("SET SCHEMA CIL") 
      const sql = `INSERT INTO ${schema}.QCUSTCDT (CUSNUM,LSTNAM,INIT,STREET, CITY,STATE,ZIPCOD,CDTLMT,CHGCOD,BALDUE,CDTDUE) 
      VALUES (${data.CUSNUM}, '${data.LSTNAM}', '${data.INIT}', '${data.STREET}', '${data.CITY}', '${data.STATE}', ${data.ZIPCOD}, ${data.CDTLMT}, ${data.CHGCOD}, ${data.BALDUE}, ${data.CDTDUE}
      ) with nc`;
      await statement.prepare(sql);  
      await statement.execute();
      await statement.close();
      await connection.disconn();
      return data.CUSNUM;

    } catch (errorMessage) {
      throw new MissingResourceError(errorMessage)
    }
  }

  async function find(id) {
    let customer;
    try {
      const connection = new Connection({ url: '*LOCAL' });
      const statement = new Statement(connection);
      // await statement.exec("SET SCHEMA QIWS") 
      const sql = `SELECT * FROM ${schema}.QCUSTCDT where CUSNUM='${id}'`;
      await statement.prepare(sql);  
      await statement.execute();
      customer = await statement.fetchAll();
      // debug("Find customer : %O", customer);
      await statement.close();
      await connection.disconn();
    } catch (errorMessage) {
      throw new MissingResourceError(errorMessage)
    }
    if (customer.length == 0) {
      throw new NoDataError('No data');
    }
    
    // return customer[0].toJSON();
    return JSON.stringify(customer[0]);
  }

  async function update(id, data) {
    try {

      debug("Update customer : %O", id)      
      debug("Update customer : %O", data)      
      const connection = new Connection({ url: '*LOCAL' });
      const statement = new Statement(connection);
      // await statement.exec("SET SCHEMA CIL") 
      let sql = `UPDATE ${schema}.QCUSTCDT SET `;
      if (data.LSTNAM){
        sql += `LSTNAM='${data.LSTNAM}' `
      }
      if (data.INIT){
        sql += `INIT='${data.INIT}' `
      }
      if (data.STREET){
        sql += `STREET='${data.STREET}' `
      }
      if (data.CITY){
        sql += `CITY='${data.CITY}' `
      }
      if (data.STATE){
        sql += `STATE='${data.STATE}' `
      }
      if (data.ZIPCOD){
        sql += `ZIPCOD='${data.ZIPCOD}' `
      }
      if (data.CDTLMT){
        sql += `CDTLMT='${data.CDTLMT}' `
      }
      if (data.CHGCOD){
        sql += `CHGCOD='${data.CHGCOD}' `
      }
      if (data.BALDUE){
        sql += `BALDUE='${data.BALDUE}' `
      }
      if (data.CDTDUE){
        sql += `CDTDUE='${data.CDTDUE}' `
      }
      
      sql += `WHERE CUSNUM='${id}' with nc`;
      debug("SQL ", sql)   
      await statement.prepare(sql);  
      await statement.execute();
      await statement.close();
      await connection.disconn();
      
      return true;

    } catch (errorMessage) {
      throw new MissingResourceError(errorMessage)
    }
  }

  async function remove(id) {
    try {
      debug("Delete customer : %O", id)      
      const connection = new Connection({ url: '*LOCAL' });
      const statement = new Statement(connection);
      // await statement.exec("SET SCHEMA CIL") 
      const sql = `DELETE FROM ${schema}.QCUSTCDT WHERE CUSNUM='${id}' with nc`;
      await statement.prepare(sql);  
      await statement.execute();
      await statement.close();
      await connection.disconn();
      
      return true;

    } catch (errorMessage) {
      throw new MissingResourceError(errorMessage)
    }
  }
};
