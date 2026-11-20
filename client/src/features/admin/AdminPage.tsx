import { Alert, Button, Checkbox, Divider, FormControlLabel, Grid, MenuItem, Pagination, Paper, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import agent, { errorMessage, errorStatus, type AdminProduct, type Page } from "../../app/api/agent";
import type { Brand } from "../../app/models/brand";
import type { Type } from "../../app/models/type";
import Spinner from "../../app/layout/Spinner";
import { rupiah } from "../../app/util/util";

const imageFiles = Object.keys(import.meta.glob("/public/images/products/*"))
  .map(path => path.split("/").pop() ?? "").filter(name => /\.(png|jpg|jpeg|webp)$/.test(name)).sort();

const emptyProduct: AdminProduct = {
  name: "", description: "", price: 0, stock: 0, pictureUrl: "", brandId: 0, typeId: 0, active: true,
};

export default function AdminPage() {
  const [products, setProducts] = useState<Page<AdminProduct>>();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [product, setProduct] = useState<AdminProduct>();
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadError(false);
    Promise.all([agent.Admin.products(page), agent.Store.brands(), agent.Store.types()])
      .then(([products, brands, types]) => {
        if (active) {
          setProducts(products);
          setBrands(brands);
          setTypes(types);
        }
      })
      .catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, [page, reload]);

  async function save() {
    if (!product || busy) return;
    setBusy(true);
    setError("");
    try {
      await agent.Admin.saveProduct(product);
      if (!product.id) setPage(1);
      setProduct(undefined);
      setReload(value => value + 1);
    } catch (error) {
      setError(errorMessage(error, "Could not save product. Review the fields and try again."));
      if (errorStatus(error) === 409) setReload(value => value + 1);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack spacing={3} className="av-page">
      <div className="av-page-intro"><h1 className="av-display">MANAGE PRODUCTS.</h1></div>
      <Stack direction="row" spacing={2}>
        <Button component={Link} to="/admin/orders">Manage orders</Button>
        <Button variant="contained" disabled={!products || !!product} onClick={() => setProduct(emptyProduct)}>Add product</Button>
      </Stack>
      {product && <Paper className="av-panel" elevation={0} sx={{ p: 2 }}>
        <Typography component="h2" variant="h6" gutterBottom>{product.id ? `Edit product #${product.id}` : "New product"}</Typography>
        <Stack component="form" spacing={2} onSubmit={event => { event.preventDefault(); void save(); }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField required label="Name" value={product.name} inputProps={{ maxLength: 255 }}
            onChange={event => setProduct({ ...product, name: event.target.value })} />
          <TextField required multiline label="Description" value={product.description} inputProps={{ maxLength: 10000 }}
            onChange={event => setProduct({ ...product, description: event.target.value })} />
          <Grid container gap={2}>
            <TextField required label="Price (IDR)" type="number" value={product.price} inputProps={{ min: 0, max: 1e12 }}
              onChange={event => setProduct({ ...product, price: Number(event.target.value) })} />
            <TextField required label="Stock" type="number" value={product.stock} inputProps={{ min: 0, max: 1000000 }}
              onChange={event => setProduct({ ...product, stock: Number(event.target.value) })} />
          </Grid>
          <TextField select required label="Brand" value={product.brandId || ""} onChange={event => setProduct({ ...product, brandId: Number(event.target.value) })}>
            {brands.map(brand => <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>)}
          </TextField>
          <TextField select required label="Type" value={product.typeId || ""} onChange={event => setProduct({ ...product, typeId: Number(event.target.value) })}>
            {types.map(type => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)}
          </TextField>
          <TextField select required label="Image" value={product.pictureUrl} onChange={event => setProduct({ ...product, pictureUrl: event.target.value })}>
            {imageFiles.map(file => <MenuItem key={file} value={file}>{file}</MenuItem>)}
          </TextField>
          <FormControlLabel label="Visible in catalog" control={<Checkbox checked={product.active} onChange={event => setProduct({ ...product, active: event.target.checked })} />} />
          <Stack direction="row" spacing={2}>
            <LoadingButton loading={busy} type="submit" variant="contained">Save product</LoadingButton>
            <Button disabled={busy} onClick={() => { setError(""); setProduct(undefined); }}>Discard</Button>
          </Stack>
        </Stack>
      </Paper>}
      {loadError ? <Alert severity="error" action={<Button onClick={() => setReload(value => value + 1)}>Retry</Button>}>Could not load products.</Alert> :
        !products ? <Spinner message="Loading products..." /> :
        <Paper className="av-panel" elevation={0} sx={{ p: 2 }}>
          <Stack divider={<Divider />}>
            {products.content.map(item => <Stack key={item.id} spacing={1} direction={{ xs: "column", sm: "row" }}
              sx={{ py: 1.5, alignItems: { sm: "center" } }}>
              <Typography sx={{ flex: 1 }}>{item.name}</Typography>
              <Typography>{rupiah.format(item.price)} · {item.stock} in stock · {item.active ? "Visible" : "Hidden"}</Typography>
              <Button disabled={!!product} onClick={() => setProduct(item)}>Edit</Button>
            </Stack>)}
          </Stack>
        </Paper>}
      {products && products.page.totalPages > 1 &&
        <Pagination count={products.page.totalPages} page={page} onChange={(_, value) => setPage(value)} />}
    </Stack>
  );
}
