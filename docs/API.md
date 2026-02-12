# API Reference
## AI Grant Applications — Shadwell Basin

**Version:** 0.1  
**Date:** 2026-02-12

---

## 1. Overview

All API routes are under `/api/`. Authentication is required for all endpoints except `/api/auth/*`.

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://[domain]/api`

### Authentication
Include Supabase session token in cookies (automatic with `@supabase/ssr`) or Authorization header:
```
Authorization: Bearer <access_token>
```

### Response Format
```typescript
// Success
{
  "data": T,
  "error": null
}

// Error
{
  "data": null,
  "error": {
    "message": string,
    "code": string
  }
}
```

---

## 2. Projects

### List Projects
```
GET /api/projects
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status (draft, submitted, etc.) |
| `sort` | string | Sort field (created_at, updated_at, name) |
| `order` | string | Sort order (asc, desc) |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Sport England Youth Sailing",
      "funder": "Sport England",
      "deadline": "2025-03-15",
      "status": "draft",
      "created_by": "uuid",
      "created_at": "2025-02-12T10:00:00Z",
      "updated_at": "2025-02-12T10:00:00Z",
      "documents_count": 4
    }
  ],
  "error": null
}
```

---

### Get Project
```
GET /api/projects/[id]
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Sport England Youth Sailing",
    "funder": "Sport England",
    "deadline": "2025-03-15",
    "status": "draft",
    "created_by": "uuid",
    "created_at": "2025-02-12T10:00:00Z",
    "updated_at": "2025-02-12T10:00:00Z",
    "documents": [
      {
        "id": "uuid",
        "title": "About Us",
        "sort_order": 0
      }
    ]
  },
  "error": null
}
```

---

### Create Project
```
POST /api/projects
```

**Request Body:**
```json
{
  "name": "Sport England Youth Sailing",
  "funder": "Sport England",
  "deadline": "2025-03-15",
  "sections": ["about", "need", "project", "budget"]
}
```

**Response:** Created project object (same as GET)

---

### Update Project
```
PATCH /api/projects/[id]
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "status": "submitted"
}
```

**Response:** Updated project object

---

### Delete Project
```
DELETE /api/projects/[id]
```

**Response:**
```json
{
  "data": { "success": true },
  "error": null
}
```

---

## 3. Documents

### List Documents
```
GET /api/projects/[projectId]/documents
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "project_id": "uuid",
      "title": "About Us",
      "content": "# About Us\n\nContent here...",
      "sort_order": 0,
      "created_at": "2025-02-12T10:00:00Z",
      "updated_at": "2025-02-12T10:00:00Z"
    }
  ],
  "error": null
}
```

---

### Get Document
```
GET /api/projects/[projectId]/documents/[id]
```

**Response:** Single document object

---

### Create Document
```
POST /api/projects/[projectId]/documents
```

**Request Body:**
```json
{
  "title": "New Section",
  "content": "",
  "sort_order": 5
}
```

**Response:** Created document object

---

### Update Document
```
PATCH /api/projects/[projectId]/documents/[id]
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**Response:** Updated document object

---

### Delete Document
```
DELETE /api/projects/[projectId]/documents/[id]
```

**Response:**
```json
{
  "data": { "success": true },
  "error": null
}
```

---

### Reorder Documents
```
POST /api/projects/[projectId]/documents/reorder
```

**Request Body:**
```json
{
  "order": ["doc-id-1", "doc-id-2", "doc-id-3"]
}
```

**Response:**
```json
{
  "data": { "success": true },
  "error": null
}
```

---

## 4. Chat

### Send Message
```
POST /api/projects/[projectId]/chat
```

**Request Body:**
```json
{
  "message": "Help me write an About Us section"
}
```

**Response:** Server-Sent Events (SSE) stream

```
event: message_start
data: {"id": "msg-uuid"}

event: content_delta
data: {"delta": "Based on your"}

event: content_delta
data: {"delta": " annual report..."}

event: message_end
data: {"id": "msg-uuid", "content": "Full message content..."}
```

---

### Get Chat History
```
GET /api/projects/[projectId]/chat
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `limit` | number | Max messages to return (default: 50) |
| `before` | string | Cursor for pagination (message ID) |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "role": "user",
      "content": "Help me write an About Us section",
      "created_at": "2025-02-12T10:00:00Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "Based on your annual report...",
      "created_at": "2025-02-12T10:00:05Z"
    }
  ],
  "error": null
}
```

---

### Clear Chat History
```
DELETE /api/projects/[projectId]/chat
```

**Response:**
```json
{
  "data": { "success": true },
  "error": null
}
```

---

## 5. Knowledge Base

### List Files
```
GET /api/knowledge
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "filename": "Annual Report 2024.pdf",
      "file_size": 122880,
      "mime_type": "application/pdf",
      "openai_status": "ready",
      "uploaded_by": "uuid",
      "created_at": "2025-02-12T10:00:00Z"
    }
  ],
  "error": null
}
```

---

### Upload File
```
POST /api/knowledge
Content-Type: multipart/form-data
```

**Request Body:**
- `file`: File binary

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "filename": "Annual Report 2024.pdf",
    "file_size": 122880,
    "mime_type": "application/pdf",
    "openai_status": "pending",
    "created_at": "2025-02-12T10:00:00Z"
  },
  "error": null
}
```

---

### Get File Status
```
GET /api/knowledge/[id]
```

**Response:** Single file object with current status

---

### Delete File
```
DELETE /api/knowledge/[id]
```

**Response:**
```json
{
  "data": { "success": true },
  "error": null
}
```

---

### Retry Failed Processing
```
POST /api/knowledge/[id]/retry
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "openai_status": "processing"
  },
  "error": null
}
```

---

## 6. Export

### Export Document to Word
```
GET /api/export/document/[id]
```

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Content-Disposition: `attachment; filename="About Us.docx"`
- Body: Binary .docx file

---

### Export Project to Word
```
GET /api/export/project/[id]
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `format` | string | `single` (one file) or `zip` (multiple files) |

**Response:**
- Single: .docx file with all sections
- ZIP: .zip file containing individual .docx files

---

## 7. User Profile

### Get Current User
```
GET /api/me
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "email": "mike@shadwellbasin.org",
    "full_name": "Mike Wardle",
    "role": "admin",
    "created_at": "2025-02-12T10:00:00Z"
  },
  "error": null
}
```

---

### Update Profile
```
PATCH /api/me
```

**Request Body:**
```json
{
  "full_name": "Mike Wardle"
}
```

**Response:** Updated profile object

---

## 8. Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request body |
| `FILE_TOO_LARGE` | 400 | File exceeds size limit |
| `UNSUPPORTED_FILE_TYPE` | 400 | File type not allowed |
| `OPENAI_ERROR` | 500 | OpenAI API error |
| `PROCESSING_ERROR` | 500 | File processing failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## 9. Rate Limits

| Endpoint | Limit |
|----------|-------|
| Chat (POST) | 20 requests/minute |
| File upload | 10 files/minute |
| All other endpoints | 100 requests/minute |

Rate limit headers:
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1707735600
```

---

## 10. Webhooks (Future)

Reserved for future use:
- `POST /api/webhooks/openai` - OpenAI processing callbacks
- `POST /api/webhooks/supabase` - Database triggers
