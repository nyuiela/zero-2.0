use serde::{ Deserialize, Serialize };
pub mod car;
pub mod bid;
pub mod auction;
pub mod overall;
pub mod auth;
pub mod jwt;
pub mod redis;
pub mod comment;
pub mod saved_auction;
#[derive(Debug, Serialize, Deserialize)]
pub struct SessionStats {
    /// Count of segments in this proof request
    pub segments: usize,

    /// Total cycles run within guest
    pub total_cycles: u64,

    /// User cycles run within guest
    pub user_cycles: u64,

    /// Paging cycles run within guest
    pub paging_cycles: u64,

    /// Reserved cycles run within guest
    pub reserved_cycles: u64,
}
