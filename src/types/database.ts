// Database types for Supabase
// Generate with: npx supabase gen types typescript --project-id <id> > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: "admin" | "member";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: "admin" | "member";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: "admin" | "member";
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          funder: string | null;
          deadline: string | null;
          status: "draft" | "submitted" | "successful" | "unsuccessful" | "archived";
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          funder?: string | null;
          deadline?: string | null;
          status?: "draft" | "submitted" | "successful" | "unsuccessful" | "archived";
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          funder?: string | null;
          deadline?: string | null;
          status?: "draft" | "submitted" | "successful" | "unsuccessful" | "archived";
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          content: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          content?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          content?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      knowledge_files: {
        Row: {
          id: string;
          filename: string;
          file_path: string;
          file_size: number | null;
          mime_type: string | null;
          openai_file_id: string | null;
          openai_status: "pending" | "processing" | "ready" | "error";
          error_message: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          filename: string;
          file_path: string;
          file_size?: number | null;
          mime_type?: string | null;
          openai_file_id?: string | null;
          openai_status?: "pending" | "processing" | "ready" | "error";
          error_message?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          filename?: string;
          file_path?: string;
          file_size?: number | null;
          mime_type?: string | null;
          openai_file_id?: string | null;
          openai_status?: "pending" | "processing" | "ready" | "error";
          error_message?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          project_id: string;
          role: "user" | "assistant";
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          role: "user" | "assistant";
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          role?: "user" | "assistant";
          content?: string;
          created_at?: string;
        };
      };
      assistant_threads: {
        Row: {
          id: string;
          project_id: string;
          thread_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          thread_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          thread_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Helper types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Convenience types
export type Profile = Tables<"profiles">;
export type Project = Tables<"projects">;
export type Document = Tables<"documents">;
export type KnowledgeFile = Tables<"knowledge_files">;
export type ChatMessage = Tables<"chat_messages">;
export type AssistantThread = Tables<"assistant_threads">;
