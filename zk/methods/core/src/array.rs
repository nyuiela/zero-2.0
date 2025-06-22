#![no_std]

use core::fmt::{ Debug, Formatter, Result as FmtResult };

pub struct MiniVec<T, const N: usize> {
    data: [T; N],
    len: usize,
}

impl<T: Copy + Default, const N: usize> MiniVec<T, N> {
    pub const fn new() -> Self {
        Self {
            data: [T::default(); N],
            len: 0,
        }
    }

    pub fn push(&mut self, value: T) -> Result<(), &'static str> {
        if self.len >= N {
            return Err("MiniVec is full");
        }
        self.data[self.len] = value;
        self.len += 1;
        Ok(())
    }

    pub fn get(&self, index: usize) -> Option<T> {
        if index < self.len { Some(self.data[index]) } else { None }
    }

    pub fn len(&self) -> usize {
        self.len
    }

    pub fn as_slice(&self) -> &[T] {
        &self.data[..self.len]
    }
}

impl<T: Debug, const N: usize> Debug for MiniVec<T, N> {
    fn fmt(&self, f: &mut Formatter<'_>) -> FmtResult {
        f.debug_list()
            .entries(&self.data[..self.len])
            .finish()
    }
}
