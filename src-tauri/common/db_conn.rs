use sea_orm::{ConnectionOptions,Database,DatabaseConnection};

pub fn get_db_conn()->DatabaseConnection{
    let mut opt = ConnectionOptions::new("sqlite:/data.db");
    let db = Database::connect(opt).await.expect("数据库连接失败");
}