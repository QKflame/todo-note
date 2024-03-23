import {Database} from "better-sqlite3";

const sql = [
  `
    BEGIN TRANSACTION;

    -- 表：groups
    CREATE TABLE IF NOT EXISTS groups (
        id         INTEGER      PRIMARY KEY AUTOINCREMENT
                                UNIQUE
                                NOT NULL,
        title      TEXT (30)    NOT NULL,
        deleteTime INTEGER (13),
        parentId   INTEGER,
        createTime INTEGER (13) NOT NULL,
        type       INTEGER      DEFAULT (1)
    );

    -- 表：notes
    CREATE TABLE IF NOT EXISTS notes (
        id            INTEGER PRIMARY KEY,
        title         TEXT    NOT NULL,
        content       TEXT,
        groupId       INTEGER NOT NULL,
        createTime    INTEGER NOT NULL,
        updateTime    INTEGER NOT NULL,
        deleteTime    INTEGER,
        originGroupId INTEGER
    );

    -- 表：plans
    CREATE TABLE IF NOT EXISTS plans (
        id         INTEGER      PRIMARY KEY AUTOINCREMENT
                                UNIQUE
                                NOT NULL,
        title      TEXT (30)    NOT NULL,
        deleteTime INTEGER (13),
        parentId   INTEGER,
        createTime INTEGER (13) NOT NULL
    );

    -- 表：todos
    CREATE TABLE IF NOT EXISTS todos (
        id         INTEGER      PRIMARY KEY AUTOINCREMENT,
        name       TEXT (40)    NOT NULL,
        groupId    INTEGER      NOT NULL,
        createTime INTEGER (13) NOT NULL,
        updateTime INTEGER (13) NOT NULL,
        deleteTime BLOB (13),
        priority   INTEGER (1),
        progress   INTEGER (1),
        content    TEXT,
        deadline   INTEGER
    );

    -- 表：versions
    CREATE TABLE IF NOT EXISTS versions (
        id         INTEGER      PRIMARY KEY AUTOINCREMENT,
        version       TEXT (40)    NOT NULL,
        createTime INTEGER (13) NOT NULL
    );

    INSERT INTO versions (version, createTime) VALUES ('1.0', ${new Date().getTime()});

    COMMIT TRANSACTION;
  `
];

export class DatabaseUpgrade {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  private getInitSql() {
    let query = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?");
    const tableName = 'versions';
    const isExist = query.get(tableName);

    // versions 表没存在
    if (!isExist) {
      return sql;
    }

    // 查询表中 id 最大的一条数据
    query = this.db.prepare('SELECT version FROM versions ORDER BY id DESC LIMIT 1');
    const latestVersion = parseInt(query.get() as string);

    return sql.slice(latestVersion);
  }

  public exec() {
    const sqlList = this.getInitSql();
    sqlList.forEach(item => {
      this.db.exec(item);
    });
  }
}
