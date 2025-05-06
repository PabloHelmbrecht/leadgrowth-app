export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            actions: {
                Row: {
                    completed_at: string | null
                    contact_id: string | null
                    created_at: string
                    creator_id: string
                    due_at: string | null
                    executed_at: string | null
                    id: string
                    node_id: string | null
                    owner_id: string
                    priority: Database["public"]["Enums"]["priority"] | null
                    scheduled_at: string | null
                    skipped_at: string | null
                    status: Database["public"]["Enums"]["action_status"]
                    team_id: string
                    type: string | null
                    workflow_id: string | null
                }
                Insert: {
                    completed_at?: string | null
                    contact_id?: string | null
                    created_at?: string
                    creator_id: string
                    due_at?: string | null
                    executed_at?: string | null
                    id?: string
                    node_id?: string | null
                    owner_id: string
                    priority?: Database["public"]["Enums"]["priority"] | null
                    scheduled_at?: string | null
                    skipped_at?: string | null
                    status?: Database["public"]["Enums"]["action_status"]
                    team_id: string
                    type?: string | null
                    workflow_id?: string | null
                }
                Update: {
                    completed_at?: string | null
                    contact_id?: string | null
                    created_at?: string
                    creator_id?: string
                    due_at?: string | null
                    executed_at?: string | null
                    id?: string
                    node_id?: string | null
                    owner_id?: string
                    priority?: Database["public"]["Enums"]["priority"] | null
                    scheduled_at?: string | null
                    skipped_at?: string | null
                    status?: Database["public"]["Enums"]["action_status"]
                    team_id?: string
                    type?: string | null
                    workflow_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "actions_contact_id_fkey"
                        columns: ["contact_id"]
                        isOneToOne: false
                        referencedRelation: "contacts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "actions_creator_id_fkey"
                        columns: ["creator_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "actions_node_id_fkey"
                        columns: ["node_id"]
                        isOneToOne: false
                        referencedRelation: "nodes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "actions_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "actions_team_id_fkey"
                        columns: ["team_id"]
                        isOneToOne: false
                        referencedRelation: "teams"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "actions_workflow_id_fkey"
                        columns: ["workflow_id"]
                        isOneToOne: false
                        referencedRelation: "workflows"
                        referencedColumns: ["id"]
                    },
                ]
            }
            companies: {
                Row: {
                    created_at: string
                    creator_id: string | null
                    headcount: number | null
                    id: string
                    industry: string | null
                    name: string | null
                    owner_id: string | null
                    team_id: string | null
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    creator_id?: string | null
                    headcount?: number | null
                    id?: string
                    industry?: string | null
                    name?: string | null
                    owner_id?: string | null
                    team_id?: string | null
                    updated_at?: string
                }
                Update: {
                    created_at?: string
                    creator_id?: string | null
                    headcount?: number | null
                    id?: string
                    industry?: string | null
                    name?: string | null
                    owner_id?: string | null
                    team_id?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "companies_creator_id_fkey"
                        columns: ["creator_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "companies_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "companies_team_id_fkey"
                        columns: ["team_id"]
                        isOneToOne: false
                        referencedRelation: "teams"
                        referencedColumns: ["id"]
                    },
                ]
            }
            contacts: {
                Row: {
                    company_id: string | null
                    created_at: string
                    creator_id: string | null
                    email: string | null
                    first_name: string | null
                    id: string
                    last_name: string | null
                    owner_id: string | null
                    phone: string | null
                    stage_id: string | null
                    team_id: string
                    title: string | null
                    updated_at: string
                }
                Insert: {
                    company_id?: string | null
                    created_at?: string
                    creator_id?: string | null
                    email?: string | null
                    first_name?: string | null
                    id?: string
                    last_name?: string | null
                    owner_id?: string | null
                    phone?: string | null
                    stage_id?: string | null
                    team_id: string
                    title?: string | null
                    updated_at?: string
                }
                Update: {
                    company_id?: string | null
                    created_at?: string
                    creator_id?: string | null
                    email?: string | null
                    first_name?: string | null
                    id?: string
                    last_name?: string | null
                    owner_id?: string | null
                    phone?: string | null
                    stage_id?: string | null
                    team_id?: string
                    title?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "contacts_company_id_fkey"
                        columns: ["company_id"]
                        isOneToOne: false
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "contacts_creator_id_fkey"
                        columns: ["creator_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "contacts_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "contacts_stage_id_fkey"
                        columns: ["stage_id"]
                        isOneToOne: false
                        referencedRelation: "contacts_stages"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "contacts_team_id_fkey"
                        columns: ["team_id"]
                        isOneToOne: false
                        referencedRelation: "teams"
                        referencedColumns: ["id"]
                    },
                ]
            }
            contacts_stages: {
                Row: {
                    created_at: string
                    id: string
                    label: string
                    team_id: string
                    type: Database["public"]["Enums"]["stage_type"]
                    value: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    label: string
                    team_id: string
                    type?: Database["public"]["Enums"]["stage_type"]
                    value: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    label?: string
                    team_id?: string
                    type?: Database["public"]["Enums"]["stage_type"]
                    value?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "contacts_stages_team_id_fkey"
                        columns: ["team_id"]
                        isOneToOne: false
                        referencedRelation: "teams"
                        referencedColumns: ["id"]
                    },
                ]
            }
            custom_field_values: {
                Row: {
                    company_id: string | null
                    contact_id: string | null
                    created_at: string
                    field_id: string
                    id: string
                    node_id: string | null
                    value_boolean: boolean | null
                    value_date: string | null
                    value_number: number | null
                    value_select: string[] | null
                    value_string: string | null
                    workflow_id: string | null
                }
                Insert: {
                    company_id?: string | null
                    contact_id?: string | null
                    created_at?: string
                    field_id: string
                    id?: string
                    node_id?: string | null
                    value_boolean?: boolean | null
                    value_date?: string | null
                    value_number?: number | null
                    value_select?: string[] | null
                    value_string?: string | null
                    workflow_id?: string | null
                }
                Update: {
                    company_id?: string | null
                    contact_id?: string | null
                    created_at?: string
                    field_id?: string
                    id?: string
                    node_id?: string | null
                    value_boolean?: boolean | null
                    value_date?: string | null
                    value_number?: number | null
                    value_select?: string[] | null
                    value_string?: string | null
                    workflow_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "custom_field_values_company_id_fkey"
                        columns: ["company_id"]
                        isOneToOne: false
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "custom_field_values_contact_id_fkey"
                        columns: ["contact_id"]
                        isOneToOne: false
                        referencedRelation: "contacts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "custom_field_values_field_id_fkey"
                        columns: ["field_id"]
                        isOneToOne: false
                        referencedRelation: "custom_fields"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "custom_field_values_node_id_fkey"
                        columns: ["node_id"]
                        isOneToOne: false
                        referencedRelation: "nodes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "custom_field_values_workflow_id_fkey"
                        columns: ["workflow_id"]
                        isOneToOne: false
                        referencedRelation: "workflows"
                        referencedColumns: ["id"]
                    },
                ]
            }
            custom_fields: {
                Row: {
                    created_at: string
                    creator_id: string | null
                    entity_type: Database["public"]["Enums"]["entity_type"]
                    field_type: Database["public"]["Enums"]["field_type"]
                    id: string
                    is_required: boolean | null
                    label: string | null
                    node_id: string | null
                    options: Json | null
                    team_id: string
                    workflow_id: string | null
                }
                Insert: {
                    created_at?: string
                    creator_id?: string | null
                    entity_type: Database["public"]["Enums"]["entity_type"]
                    field_type: Database["public"]["Enums"]["field_type"]
                    id?: string
                    is_required?: boolean | null
                    label?: string | null
                    node_id?: string | null
                    options?: Json | null
                    team_id: string
                    workflow_id?: string | null
                }
                Update: {
                    created_at?: string
                    creator_id?: string | null
                    entity_type?: Database["public"]["Enums"]["entity_type"]
                    field_type?: Database["public"]["Enums"]["field_type"]
                    id?: string
                    is_required?: boolean | null
                    label?: string | null
                    node_id?: string | null
                    options?: Json | null
                    team_id?: string
                    workflow_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "custom_fields_creator_id_fkey"
                        columns: ["creator_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "custom_fields_node_id_fkey"
                        columns: ["node_id"]
                        isOneToOne: false
                        referencedRelation: "nodes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "custom_fields_team_id_fkey"
                        columns: ["team_id"]
                        isOneToOne: false
                        referencedRelation: "teams"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "custom_fields_workflow_id_fkey"
                        columns: ["workflow_id"]
                        isOneToOne: false
                        referencedRelation: "workflows"
                        referencedColumns: ["id"]
                    },
                ]
            }
            edges: {
                Row: {
                    created_at: string
                    id: string | null
                    source_id: string
                    target_id: string
                    time_delay: number
                    time_delay_unit: Database["public"]["Enums"]["time_delay_unit"]
                    type: Database["public"]["Enums"]["edge_type"]
                    updated_at: string
                    workflow_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string | null
                    source_id: string
                    target_id: string
                    time_delay?: number
                    time_delay_unit?: Database["public"]["Enums"]["time_delay_unit"]
                    type?: Database["public"]["Enums"]["edge_type"]
                    updated_at?: string
                    workflow_id: string
                }
                Update: {
                    created_at?: string
                    id?: string | null
                    source_id?: string
                    target_id?: string
                    time_delay?: number
                    time_delay_unit?: Database["public"]["Enums"]["time_delay_unit"]
                    type?: Database["public"]["Enums"]["edge_type"]
                    updated_at?: string
                    workflow_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "edges_source_id_fkey"
                        columns: ["source_id"]
                        isOneToOne: false
                        referencedRelation: "nodes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "edges_target_id_fkey"
                        columns: ["target_id"]
                        isOneToOne: false
                        referencedRelation: "nodes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "edges_workflow_id_fkey"
                        columns: ["workflow_id"]
                        isOneToOne: false
                        referencedRelation: "workflows"
                        referencedColumns: ["id"]
                    },
                ]
            }
            events: {
                Row: {
                    action_id: string
                    created_at: string
                    data: Json | null
                    id: string
                    team_id: string
                    type: Database["public"]["Enums"]["event_type"]
                }
                Insert: {
                    action_id: string
                    created_at?: string
                    data?: Json | null
                    id?: string
                    team_id: string
                    type: Database["public"]["Enums"]["event_type"]
                }
                Update: {
                    action_id?: string
                    created_at?: string
                    data?: Json | null
                    id?: string
                    team_id?: string
                    type?: Database["public"]["Enums"]["event_type"]
                }
                Relationships: [
                    {
                        foreignKeyName: "events_action_id_fkey"
                        columns: ["action_id"]
                        isOneToOne: false
                        referencedRelation: "actions"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "events_team_id_fkey"
                        columns: ["team_id"]
                        isOneToOne: false
                        referencedRelation: "teams"
                        referencedColumns: ["id"]
                    },
                ]
            }
            executions: {
                Row: {
                    contact_id: string
                    created_at: string
                    current_step: string
                    status: Database["public"]["Enums"]["contact_status"]
                    workflow_id: string
                }
                Insert: {
                    contact_id: string
                    created_at?: string
                    current_step: string
                    status?: Database["public"]["Enums"]["contact_status"]
                    workflow_id: string
                }
                Update: {
                    contact_id?: string
                    created_at?: string
                    current_step?: string
                    status?: Database["public"]["Enums"]["contact_status"]
                    workflow_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "contacts_workflows_contact_id_fkey"
                        columns: ["contact_id"]
                        isOneToOne: false
                        referencedRelation: "contacts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "contacts_workflows_current_step_fkey"
                        columns: ["current_step"]
                        isOneToOne: false
                        referencedRelation: "nodes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "contacts_workflows_workflow_id_fkey"
                        columns: ["workflow_id"]
                        isOneToOne: false
                        referencedRelation: "workflows"
                        referencedColumns: ["id"]
                    },
                ]
            }
            members: {
                Row: {
                    joined_at: string
                    role: Database["public"]["Enums"]["role"]
                    status: Database["public"]["Enums"]["member_status"]
                    team_id: string
                    user_id: string
                }
                Insert: {
                    joined_at?: string
                    role?: Database["public"]["Enums"]["role"]
                    status?: Database["public"]["Enums"]["member_status"]
                    team_id: string
                    user_id: string
                }
                Update: {
                    joined_at?: string
                    role?: Database["public"]["Enums"]["role"]
                    status?: Database["public"]["Enums"]["member_status"]
                    team_id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "members_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "teams_users_team_id_fkey"
                        columns: ["team_id"]
                        isOneToOne: false
                        referencedRelation: "teams"
                        referencedColumns: ["id"]
                    },
                ]
            }
            nodes: {
                Row: {
                    created_at: string
                    data: Json
                    id: string
                    position_x: number | null
                    position_y: number | null
                    type: Database["public"]["Enums"]["node_type"]
                    updated_at: string
                    workflow_id: string
                }
                Insert: {
                    created_at?: string
                    data?: Json
                    id?: string
                    position_x?: number | null
                    position_y?: number | null
                    type: Database["public"]["Enums"]["node_type"]
                    updated_at?: string
                    workflow_id: string
                }
                Update: {
                    created_at?: string
                    data?: Json
                    id?: string
                    position_x?: number | null
                    position_y?: number | null
                    type?: Database["public"]["Enums"]["node_type"]
                    updated_at?: string
                    workflow_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "nodes_workflow_id_fkey"
                        columns: ["workflow_id"]
                        isOneToOne: false
                        referencedRelation: "workflows"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    email: string
                    first_name: string | null
                    id: string
                    last_name: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    email: string
                    first_name?: string | null
                    id: string
                    last_name?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    email?: string
                    first_name?: string | null
                    id?: string
                    last_name?: string | null
                }
                Relationships: []
            }
            tags: {
                Row: {
                    color: string | null
                    created_at: string
                    id: string
                    label: string | null
                    team_id: string | null
                    value: string | null
                }
                Insert: {
                    color?: string | null
                    created_at?: string
                    id?: string
                    label?: string | null
                    team_id?: string | null
                    value?: string | null
                }
                Update: {
                    color?: string | null
                    created_at?: string
                    id?: string
                    label?: string | null
                    team_id?: string | null
                    value?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "tags_team_id_fkey"
                        columns: ["team_id"]
                        isOneToOne: false
                        referencedRelation: "teams"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tags_workflows: {
                Row: {
                    created_at: string
                    tag_id: string
                    workflow_id: string
                }
                Insert: {
                    created_at?: string
                    tag_id: string
                    workflow_id: string
                }
                Update: {
                    created_at?: string
                    tag_id?: string
                    workflow_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tags_workflows_tag_id_fkey"
                        columns: ["tag_id"]
                        isOneToOne: false
                        referencedRelation: "tags"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "tags_workflows_workflow_id_fkey"
                        columns: ["workflow_id"]
                        isOneToOne: false
                        referencedRelation: "workflows"
                        referencedColumns: ["id"]
                    },
                ]
            }
            teams: {
                Row: {
                    created_at: string
                    id: string
                    is_active: boolean
                    logo_url: string | null
                    name: string | null
                }
                Insert: {
                    created_at?: string
                    id?: string
                    is_active?: boolean
                    logo_url?: string | null
                    name?: string | null
                }
                Update: {
                    created_at?: string
                    id?: string
                    is_active?: boolean
                    logo_url?: string | null
                    name?: string | null
                }
                Relationships: []
            }
            workflows: {
                Row: {
                    created_at: string
                    creator_id: string | null
                    id: string
                    name: string | null
                    owner_id: string | null
                    status: Database["public"]["Enums"]["workflow_status"]
                    team_id: string
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    creator_id?: string | null
                    id?: string
                    name?: string | null
                    owner_id?: string | null
                    status?: Database["public"]["Enums"]["workflow_status"]
                    team_id: string
                    updated_at?: string
                }
                Update: {
                    created_at?: string
                    creator_id?: string | null
                    id?: string
                    name?: string | null
                    owner_id?: string | null
                    status?: Database["public"]["Enums"]["workflow_status"]
                    team_id?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "workflows_creator_id_fkey"
                        columns: ["creator_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "workflows_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "workflows_team_id_fkey"
                        columns: ["team_id"]
                        isOneToOne: false
                        referencedRelation: "teams"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            companies_custom_fields: {
                Row: {
                    company_id: string | null
                    custom_fields: Json | null
                }
                Relationships: [
                    {
                        foreignKeyName: "custom_field_values_company_id_fkey"
                        columns: ["company_id"]
                        isOneToOne: false
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    },
                ]
            }
            contacts_custom_fields: {
                Row: {
                    contact_id: string | null
                    custom_fields: Json | null
                }
                Relationships: [
                    {
                        foreignKeyName: "custom_field_values_contact_id_fkey"
                        columns: ["contact_id"]
                        isOneToOne: false
                        referencedRelation: "contacts"
                        referencedColumns: ["id"]
                    },
                ]
            }
            workflows_flows: {
                Row: {
                    flow: Json | null
                    workflow_id: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "nodes_workflow_id_fkey"
                        columns: ["workflow_id"]
                        isOneToOne: false
                        referencedRelation: "workflows"
                        referencedColumns: ["id"]
                    },
                ]
            }
            workflows_metrics: {
                Row: {
                    active: number | null
                    bounced: number | null
                    finished: number | null
                    id: string | null
                    paused: number | null
                    spam: number | null
                    total: number | null
                    unsubscribed: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "contacts_workflows_workflow_id_fkey"
                        columns: ["id"]
                        isOneToOne: false
                        referencedRelation: "workflows"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Functions: {
            teams_for_user: {
                Args: { uid: string }
                Returns: {
                    team_id: string
                }[]
            }
            user_is_group_member: {
                Args: { id: string }
                Returns: boolean
            }
        }
        Enums: {
            action_status:
                | "scheduled"
                | "completed"
                | "skipped"
                | "pending"
                | "delayed"
                | "error"
            contact_status:
                | "active"
                | "paused"
                | "unsubscribed"
                | "bounced"
                | "spam"
                | "finished"
            edge_type: "default" | "temporal" | "custom"
            entity_type: "contact" | "company" | "workflow"
            event_type:
                | "emailOpened"
                | "emailClicked"
                | "emailReplied"
                | "linkedinConnectionAccepted"
                | "linkedinMessageReplied"
                | "callConnected"
                | "callUnanswered"
                | "callPositive"
                | "meetingScheduled"
                | "websiteVisited"
                | "meetingCompleted"
                | "meetingCancelled"
            field_type:
                | "text"
                | "textarea"
                | "number"
                | "boolean"
                | "date"
                | "datetime"
                | "select"
                | "multi_select"
            member_status: "active" | "disabled" | "deleted"
            node_type: "trigger" | "manualEmail" | "placeholder" | "default"
            priority: "high" | "medium" | "low"
            role: "admin" | "non_admin"
            stage_type:
                | "no category"
                | "in progress"
                | "succeded"
                | "not succeded"
            time_delay_unit: "hours" | "days" | "weeks"
            workflow_status: "active" | "paused" | "archived"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
              Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R
      }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
            DefaultSchema["Views"])
      ? (DefaultSchema["Tables"] &
            DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
          ? R
          : never
      : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I
      }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
      ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I
        }
          ? I
          : never
      : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U
      }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
      ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U
        }
          ? U
          : never
      : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
      ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
      : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
      ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
      : never

export const Constants = {
    public: {
        Enums: {
            action_status: [
                "scheduled",
                "completed",
                "skipped",
                "pending",
                "delayed",
                "error",
            ],
            contact_status: [
                "active",
                "paused",
                "unsubscribed",
                "bounced",
                "spam",
                "finished",
            ],
            edge_type: ["default", "temporal", "custom"],
            entity_type: ["contact", "company", "workflow"],
            event_type: [
                "emailOpened",
                "emailClicked",
                "emailReplied",
                "linkedinConnectionAccepted",
                "linkedinMessageReplied",
                "callConnected",
                "callUnanswered",
                "callPositive",
                "meetingScheduled",
                "websiteVisited",
                "meetingCompleted",
                "meetingCancelled",
            ],
            field_type: [
                "text",
                "textarea",
                "number",
                "boolean",
                "date",
                "datetime",
                "select",
                "multi_select",
            ],
            member_status: ["active", "disabled", "deleted"],
            node_type: ["trigger", "manualEmail", "placeholder", "default"],
            priority: ["high", "medium", "low"],
            role: ["admin", "non_admin"],
            stage_type: [
                "no category",
                "in progress",
                "succeded",
                "not succeded",
            ],
            time_delay_unit: ["hours", "days", "weeks"],
            workflow_status: ["active", "paused", "archived"],
        },
    },
} as const
