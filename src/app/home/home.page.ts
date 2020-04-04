import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  databaseObj: SQLiteObject;
  name_model: string = "";
  row_data: any = [];
  readonly database_name: string = "freaky_datatable.db";
  readonly table_name: string = "myfreakytable";
  updateActive: boolean;
  to_update_item: any;

  constructor(
    private platform: Platform,
    private sqlite: SQLite

  ) {
    this.platform.ready().then(() => {
      this.createDB();
    }).catch(error => {
      console.log(error);
    })

  }
  createDB() {
    this.sqlite.create({
      name: this.database_name,
      location: 'default'

    })
    .then((db: SQLiteObject) => {
      this.databaseObj = db;
      alert('BANCO CRIADO');
    })
    .catch(e => {
      alert("error" + JSON.stringify(e))
    });
  }
  createTable() {
    this.databaseObj.executeSql(`CREATE TABLE IF NOT EXISTS ${this.table_name} (pid INTEGER PRIMARY KEY, Name varchar(255))
    ` , [])
      .then(() => {
        alert('Tabela criada');

      })
      .catch(e => {
        alert("error" + JSON.stringify(e))
      });
  }
  insertRow() {
    if(!this.name_model.length) {
      alert("Enter");
      return;
    }

    this.databaseObj.executeSql(`INSERT INTO ${this.table_name} (Name) VALUES ('${this.name_model}')
    `, [])
      .then(() => {
        alert('Row Inserted!');
        this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
    });
  }
  getRows() {
    this.databaseObj.executeSql(`
    SELECT * FROM ${this.table_name}
    `
      , [])
      .then((res) => {
        this.row_data = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.row_data.push(res.rows.item(i));
          }
        }
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      }); 
  }
  deleteRow(item) {
    this.databaseObj.executeSql(`
      DELETE FROM ${this.table_name} WHERE pid = ${item.pid}
    `
      , [])
      .then((res) => {
        alert("Usuario Deletado!");
        this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  enableUpdate(item) {
    this.updateActive = true;
    this.to_update_item = item;
    this.name_model = item.Name;
  }
  updateRow() {
    this.databaseObj.executeSql(`
      UPDATE ${this.table_name}
      SET Name = '${this.name_model}'
      WHERE pid = ${this.to_update_item.pid}
    `, [])
      .then(() => {
        alert('Row Updated!');
        this.updateActive = false;
        this.getRows();
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }
}
