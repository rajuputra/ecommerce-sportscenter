import { useEffect, useState } from "react";
import { Alert, Box, Button, MenuItem, Pagination, Stack, TextField, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import agent, { type Page } from "../../app/api/agent";
import type { Product } from "../../app/models/product";
import type { Brand } from "../../app/models/brand";
import type { Type } from "../../app/models/type";
import Spinner from "../../app/layout/Spinner";
import ProductList from "./ProductList";

const sorts = [
  { value: "name:asc", label: "Name A–Z" },
  { value: "name:desc", label: "Name Z–A" },
  { value: "price:asc", label: "Price: low to high" },
  { value: "price:desc", label: "Price: high to low" },
];

export default function Catalog() {
  const [query, setQuery] = useSearchParams();
  const keyword = (query.get("q") ?? "").slice(0, 100);
  const [draft, setDraft] = useState(keyword);
  const page = Math.max(1, Number.parseInt(query.get("page") ?? "1", 10) || 1);
  const brandId = Number(query.get("brand")) || undefined;
  const typeId = Number(query.get("type")) || undefined;
  const selectedSort = sorts.find(option => option.value === query.get("sort"))?.value ?? "name:asc";
  const [sort, order] = selectedSort.split(":");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [result, setResult] = useState<Page<Product>>();
  const [error, setError] = useState("");
  const [filterError, setFilterError] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => { setDraft(keyword); }, [keyword]);
  useEffect(() => {
    let active = true;
    setFilterError(false);
    Promise.all([agent.Store.brands(), agent.Store.types()]).then(([brands, types]) => {
      if (active) {
        setBrands(brands);
        setTypes(types);
      }
    }).catch(() => { if (active) setFilterError(true); });
    return () => { active = false; };
  }, [reload]);

  useEffect(() => {
    const controller = new AbortController();
    setResult(undefined);
    setError("");
    agent.Store.list(page, 12, { keyword, brandId, typeId, sort, order }, controller.signal)
      .then(data => {
        if (controller.signal.aborted) return;
        const lastPage = Math.max(1, data.page.totalPages);
        if (page > lastPage) {
          setQuery(previous => {
            const next = new URLSearchParams(previous);
            next.set("page", String(lastPage));
            return next;
          }, { replace: true });
        } else setResult(data);
      })
      .catch(() => { if (!controller.signal.aborted) setError("Could not load the catalog."); });
    return () => controller.abort();
  }, [page, keyword, brandId, typeId, sort, order, reload, setQuery]);

  function change(key: string, value: string) {
    const next = new URLSearchParams(query);
    if (key !== "page") next.delete("page");
    if (value) next.set(key, value);
    else next.delete(key);
    setQuery(next);
  }

  return (
    <Stack spacing={2} className="av-page">
      <div className="av-page-intro">
        <h1 className="av-display">SHOP THE GEAR.</h1>
        <p>Find court shoes, rackets, footballs, and bags for your next game.</p>
      </div>
      {types.length > 0 && <div className="av-shop-categories" aria-label="Shop categories" role="group">
        <button type="button" aria-pressed={!typeId} onClick={() => change("type", "")}>All gear</button>
        {types.map(type => <button type="button" key={type.id} aria-pressed={type.id === typeId}
          onClick={() => change("type", String(type.id))}>{type.name === "Shoes" ? "Court shoes" : type.name}</button>)}
      </div>}
      <div className="av-shop-tools av-panel">
      <Box component="form" className="av-shop-search"
        onSubmit={event => { event.preventDefault(); change("q", draft.trim()); }}>
        <TextField fullWidth size="small" label="Search products" value={draft}
          inputProps={{ maxLength: 100 }} onChange={event => setDraft(event.target.value)} />
        <Button type="submit" variant="contained">Search</Button>
      </Box>
      <div className="av-shop-filters">
        <TextField select size="small" label="Brand" value={brands.some(brand => brand.id === brandId) ? brandId : ""} onChange={event => change("brand", event.target.value)}>
          <MenuItem value="">All brands</MenuItem>
          {brands.map(brand => <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="Type" value={types.some(type => type.id === typeId) ? typeId : ""} onChange={event => change("type", event.target.value)}>
          <MenuItem value="">All types</MenuItem>
          {types.map(type => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="Sort" value={selectedSort} onChange={event => change("sort", event.target.value)}>
          {sorts.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
        </TextField>
        <Button onClick={() => { setDraft(""); setQuery({}); }}>Reset</Button>
      </div>
      </div>
      {filterError && <Alert severity="warning" action={<Button onClick={() => setReload(value => value + 1)}>Retry</Button>}>Could not load filters.</Alert>}
      {error ? <Alert severity="error" action={<Button onClick={() => setReload(value => value + 1)}>Retry</Button>}>{error}</Alert> :
        !result ? <Spinner message="Loading products..." /> :
        !result.content.length ? <Alert severity="info">No products match your search.</Alert> : <>
          <Typography color="text.secondary" role="status">{result.page.totalElements} products</Typography>
          <ProductList products={result.content} />
          {result.page.totalPages > 1 && <Box sx={{ alignSelf: "center" }}>
            <Pagination count={result.page.totalPages} page={page} onChange={(_, value) => change("page", String(value))} />
          </Box>}
        </>}
    </Stack>
  );
}
