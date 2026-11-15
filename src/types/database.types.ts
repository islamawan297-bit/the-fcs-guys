export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows any additional table query types without breaking strict compiler checks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
