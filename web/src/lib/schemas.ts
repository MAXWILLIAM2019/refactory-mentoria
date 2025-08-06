import { z } from "zod"

// Schema para validação dos dados da tabela de alunos
export const dataTableSchema = z.object({
  id: z.number(),
  header: z.string(),
  email: z.string().optional(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

export type DataTableRow = z.infer<typeof dataTableSchema>