// TEMPORARY STUB - Auth disabled during Prisma migration
// This file exists only to prevent build errors during migration

// Create a comprehensive stub that matches Supabase API structure
const createStubQuery = (): any => ({
  select: () => createStubQuery(),
  insert: () => createStubQuery(),
  update: () => createStubQuery(),
  delete: () => createStubQuery(),
  eq: () => createStubQuery(),
  neq: () => createStubQuery(),
  gt: () => createStubQuery(),
  gte: () => createStubQuery(),
  lt: () => createStubQuery(),
  lte: () => createStubQuery(),
  like: () => createStubQuery(),
  ilike: () => createStubQuery(),
  is: () => createStubQuery(),
  in: () => createStubQuery(),
  contains: () => createStubQuery(),
  order: () => createStubQuery(),
  limit: () => createStubQuery(),
  offset: () => createStubQuery(),
  range: () => createStubQuery(),
  single: () => Promise.resolve({ data: null, error: { message: "Database disabled during migration" } }),
  maybeSingle: () => Promise.resolve({ data: null, error: { message: "Database disabled during migration" } }),
  csv: () => Promise.resolve({ data: "", error: { message: "Database disabled during migration" } }),
  count: () => createStubQuery(),
  or: () => createStubQuery(),
  and: () => createStubQuery(),
  // Make it awaitable
  then: (resolve: any) => resolve({ data: null, error: { message: "Database disabled during migration" } }),
});

const createStubChannel = (): any => ({
  on: () => createStubChannel(),
  subscribe: () => ({ unsubscribe: () => {} }),
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
  from: () => createStubQuery(),
  rpc: () => Promise.resolve({ data: null, error: { message: "Database disabled during migration" } }),
  channel: () => createStubChannel(),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: { message: "Storage disabled during migration" } }),
      download: () => Promise.resolve({ data: null, error: { message: "Storage disabled during migration" } }),
      getPublicUrl: () => ({ data: { publicUrl: "" } }),
      remove: () => Promise.resolve({ data: null, error: { message: "Storage disabled during migration" } }),
    })
  }
};

console.warn("WARNING: Using Supabase stub - database functionality disabled during Prisma migration");