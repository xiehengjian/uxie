// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use service;
fn main() {
    let d = service::get_all_documents();
    // 打印d
    // println!("{:?}", d.);
    // tauri::Builder::default()
    //     .run(tauri::generate_context!())
    //     .expect("error while running tauri application");
}
