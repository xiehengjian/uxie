pub fn add(left: usize, right: usize) -> usize {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}

use common::entity::document::Entity as document; // Add 'crate::' to specify the current crate

use sea_orm::{Database, DatabaseConnection, EntityTrait};

pub async fn get_all_documents() -> Vec<common::entity::document::Model> {
    let db: DatabaseConnection = Database::connect("mysql://root:root@127.0.0.1:3307/test")
        .await
        .unwrap();
    let documents = document::find().all(&db).await.unwrap();
    return documents;
}
