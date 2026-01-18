import type { ColumnDef } from "@tanstack/react-table";
import z from "zod";

export const DataTableSchema = z.object({
	id: z.number(),
	header: z.string(),
	type: z.string(),
	status: z.string(),
	target: z.string(),
	limit: z.string(),
	reviewer: z.string(),
});

export type DataTableColumnDefs = ColumnDef<z.infer<typeof DataTableSchema>>;
