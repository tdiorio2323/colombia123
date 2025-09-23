// TEMPORARY STUB - Auth disabled during Prisma migration
// This file exists only to prevent build errors during migration

// Create a comprehensive stub that matches Supabase API structure
const createStubQuery = (): any => ({
  select: (...args: any[]) => createStubQuery(),
  insert: (...args: any[]) => createStubQuery(),
  update: (...args: any[]) => createStubQuery(),
  delete: (...args: any[]) => createStubQuery(),
  upsert: (...args: any[]) => createStubQuery(),
  eq: (...args: any[]) => createStubQuery(),
  neq: (...args: any[]) => createStubQuery(),
  gt: (...args: any[]) => createStubQuery(),
  gte: (...args: any[]) => createStubQuery(),
  lt: (...args: any[]) => createStubQuery(),
  lte: (...args: any[]) => createStubQuery(),
  like: (...args: any[]) => createStubQuery(),
  ilike: (...args: any[]) => createStubQuery(),
  is: (...args: any[]) => createStubQuery(),
  in: (...args: any[]) => createStubQuery(),
  contains: (...args: any[]) => createStubQuery(),
  order: (...args: any[]) => createStubQuery(),
  limit: (...args: any[]) => createStubQuery(),
  offset: (...args: any[]) => createStubQuery(),
  range: (...args: any[]) => createStubQuery(),
  single: (...args: any[]) => Promise.resolve({ data: null, error: { message: "Database disabled during migration" } }),
  maybeSingle: (...args: any[]) => Promise.resolve({ data: null, error: { message: "Database disabled during migration" } }),
  csv: (...args: any[]) => Promise.resolve({ data: "", error: { message: "Database disabled during migration" } }),
  count: (...args: any[]) => createStubQuery(),
  or: (...args: any[]) => createStubQuery(),
  and: (...args: any[]) => createStubQuery(),
  // Make it awaitable
  then: (resolve: any) => resolve({ data: null, error: { message: "Database disabled during migration" } }),
});

export const supabase = {
  // Stub object to prevent import errors
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: () => Promise.resolve({ data: null, error: { message: "Auth disabled during migration" } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Auth disabled during migration" } }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: (...args: any[]) => createStubQuery(),
  rpc: (...args: any[]) => Promise.resolve({ data: null, error: { message: "Database disabled during migration" } }),
  storage: {
    from: (...args: any[]) => ({
      upload: (...args: any[]) => Promise.resolve({ data: null, error: { message: "Storage disabled during migration" } }),
      download: (...args: any[]) => Promise.resolve({ data: null, error: { message: "Storage disabled during migration" } }),
      getPublicUrl: (...args: any[]) => ({ data: { publicUrl: "" } }),
      remove: (...args: any[]) => Promise.resolve({ data: null, error: { message: "Storage disabled during migration" } }),
    })
  }
};

console.warn("WARNING: Using Supabase stub - database functionality disabled during Prisma migration");