import {
  Box,
  Checkbox,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  Tooltip,
  TablePagination,
  TableRow,
  TextField,
  type TableCellProps,
  type SxProps,
} from "@mui/material";
import { useMemo, useState, type ReactNode } from "react";
import { IconTrashX } from "@tabler/icons-react";
import ExportIcons from "@/utils/ExportIcons";
import { iconMap } from "@/utils/Icons";
 
export type Column<T> = {
  key: keyof T | typeof ACTION_KEY;
  label: string;
  render?: (row: T) => ReactNode;
  exportable?: boolean;
};
 
export type DropdownOption = { value: string; label: string };
export type FooterRow = {
  content: Array<{ value: ReactNode; colSpan?: number }>;
};

interface TableStyles {
  captionSx?: SxProps;
  headerSx?: SxProps;
  rowHoverSx?: SxProps;
  paperSx?: SxProps;
}

interface UniversalTableProps<T extends Record<string, unknown>>
  extends TableStyles {
  data: readonly T[];
  columns: readonly Column<T>[];
  caption?: ReactNode;
  rowsPerPage?: number;
  tableSize?: "small" | "medium";
  textAlign?: TableCellProps["align"];
  showSearch?: boolean;
  showExport?: boolean;
  enableCheckbox?: boolean;
  highlightColor?: string;
  getRowId?: (row: T, index: number) => string | number;
  onSelectionChange?: (rows: T[]) => void;
  onDeleteSelected?: (rows: T[]) => void;

  dropdown?: {
    key: keyof T;
    options: readonly DropdownOption[];
    getValue: (row: T) => string;
    onChange: (row: T, value: string) => void;
  };
 
  actions?: Partial<Record<keyof typeof iconMap, (row: T) => void>>;
  footerRows?: readonly FooterRow[];
}

function buildExportData<T extends Record<string, unknown>>(
  rows: readonly T[],
  columns: readonly Column<T>[]
) {
  return rows.map((row) =>
    columns.reduce((acc, col) => {
      if (col.key !== ACTION_KEY && col.exportable !== false) {
        acc[col.label] = row[col.key];
      }
      return acc;
    }, {} as Record<string, unknown>)
  );
}

export function UniversalTable<T extends Record<string, unknown>>({
  data,
  columns,
  caption,
  rowsPerPage = 5,
  tableSize = "medium",
  textAlign = "left",
  showSearch = false,
  showExport = false,
  enableCheckbox = false,
  getRowId,
  onSelectionChange,
  onDeleteSelected,
  dropdown,
  autoUpdateDropdown,
  onDataChange,
  actions,
  footerRows = [],
  captionSx,
  headerSx,
  rowHoverSx,
  paperSx,
  highlightColor = "#ffff00",
}: UniversalTableProps<T>) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set()
  );

  const resolveRowId = (row: T, index: number) =>
    getRowId ? getRowId(row, index) : index;
 
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      columns.some(
        (col) =>
          col.key !== "actionsbuttons" &&
          col.key !== "dropdown" &&
          String(row[col.key as keyof T] ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    );
  }, [data, columns, search]);

  const paginatedData = useMemo(
    () =>
      filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredData, page, rowsPerPage]
  );

  const exportData = useMemo(
    () => buildExportData(filteredData, columns),
    [filteredData, columns]
  );

  const exportColumns = useMemo(
    () =>
      columns
        .filter((c) => c.key !== ACTION_KEY && c.exportable !== false)
        .map((c) => ({ key: c.label, label: c.label })),
    [columns]
  );
 
  const selectedRows = data.filter((r, i) =>
    selectedIds.has(resolveRowId(r, i))
  );

  const toggleRow = (row: T, index: number) => {
    const id = resolveRowId(row, index);
    const updated = new Set(selectedIds);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setSelectedIds(updated);
    onSelectionChange?.(data.filter((r, i) => updated.has(resolveRowId(r, i))));
  };

  const toggleAll = (checked: boolean) => {
    const updated = new Set<string | number>();
    if (checked) data.forEach((r, i) => updated.add(resolveRowId(r, i)));
    setSelectedIds(updated);
    onSelectionChange?.(checked ? [...data] : []);
  };
 
  return (
    <Paper sx={{ borderRadius: 3, boxShadow: 4, ...paperSx }}>
      {(showSearch || showExport) && (
        <Box
          sx={{
            px: 2,
            py: 2,
            display: "flex",
            justifyContent: {
              xs: "center",
              md: showSearch ? "space-between" : "flex-end",
            },
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {showSearch && (
            <TextField
              variant="standard"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              sx={{ minWidth: 220 }}
            />
          )}

          {showExport && (
            <ExportIcons
              data={exportData}
              columns={exportColumns}
              filename="Export"
              iconSize={22}
            />
          )}
        </Box>
      )}
      {caption && (
        <Box
          sx={{
            bgcolor: "#0ca678",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            borderRadius: showSearch || showExport ? "" : "6px 6px 0 0",
            textAlign: "center",
            py: 1,
            ...captionSx,
          }}
        >
          {caption}
        </Box>
      )}
 
      <TableContainer sx={{ position: "relative" }}>
        <Table size={tableSize}>
          <TableHead>
            <TableRow>
              {enableCheckbox && paginatedData.length > 0 && (
                <TableCell padding="checkbox" sx={{ bgcolor: "#444748ff" }}>
                  <Checkbox
                    indeterminate={
                      selectedIds.size > 0 && selectedIds.size < data.length
                    }
                    checked={
                      data.length > 0 && selectedIds.size === data.length
                    }
                    onChange={(e) => toggleAll(e.target.checked)}
                    sx={{ color: "#fff" }}
                  />
                </TableCell>
              )}
 
              {columns.map((c) => (
                <TableCell
                  key={String(col.key)}
                  align={textAlign}
                  sx={{
                    fontWeight: 700,
                    bgcolor: "#444748ff",
                    color: "#ffffff",
                    ...headerSx,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                const rowId = resolveRowId(row, index);
                return (
                  <TableRow
                    key={rowId}
                    hover
                    sx={{ "&:hover": { bgcolor: "#e6f4ea" }, ...rowHoverSx }}
                  >
                    {enableCheckbox && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedIds.has(rowId)}
                          onChange={() => toggleRow(row, index)}
                        />
                      </TableCell>
                    )}
 
                    {columns.map((col) => (
                      <TableCell key={String(col.key)} align={textAlign}>
                        {col.key === "dropdown" && dropdown ? (
                          <Select
                            size="small"
                            value={dropdown.getValue(row)}
                            onChange={(e) =>
                              dropdown.onChange(row, e.target.value)
                            }
                          >
                            {dropdown.options.map((o) => (
                              <MenuItem key={o.value} value={o.value}>
                                {o.label}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : col.key === "actionsbuttons" && actions ? (
                          <Box display="flex" gap={1}>
                            {Object.entries(iconMap).map(([k, cfg]) =>
                              actions[k as keyof typeof iconMap] ? (
                                <Tooltip key={k} title={cfg.label}>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      actions[k as keyof typeof iconMap]?.(row)
                                    }
                                    sx={{ color: cfg.color }}
                                  >
                                    {cfg.icon}
                                  </IconButton>
                                </Tooltip>
                              ) : null
                            )}
                          </Box>
                        ) : col.render ? (
                          col.render(row)
                        ) : (
                          String(row[col.key as keyof T] ?? "")
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>

          {footerRows.length > 0 && (
            <TableFooter>
              {footerRows.map((f, i) => (
                <TableRow key={i}>
                  {f.content.map((c, j) => (
                    <TableCell key={j} colSpan={c.colSpan}>
                      {c.value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          )}
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent:
            enableCheckbox && selectedRows.length > 0
              ? "space-between"
              : "flex-end",
          px: 1,
        }}
      >
        {enableCheckbox && selectedRows.length > 0 && onDeleteSelected && (
          <Tooltip
            title={
              selectedRows.length === data.length
                ? "Delete All Records"
                : `Delete ${selectedRows.length} record${
                    selectedRows.length > 1 ? "s" : ""
                  }`
            }
          >
            <IconButton
              color="error"
              onClick={() => {
                onDeleteSelected(selectedRows);
                setSelectedIds(new Set());
              }}
            >
              <IconTrashX size={20} />
            </IconButton>
          </Tooltip>
        )}
 
        {/* PAGINATION */}
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
        />
      </Box>
    </Paper>
  );
}
 
 