import { useState, useEffect, ChangeEvent } from "react";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";
import Spinner from "../../app/layout/Spinner";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  InputAdornment,
  Drawer,
  Button,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Brand } from "../../app/models/brand";
import { Type } from "../../app/models/type";

const sortOptions = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];
export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedSort, setSelectedSort] = useState("asc");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedBrandId, setSelectedBrandId] = useState(0);
  const [selectedTypeId, setSelectedTypeId] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotaItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // useEffect(()=>{
  //   agent.Store.list()
  //   .then((products)=>setProducts(products.content))
  //   .catch(error=>console.log(error))
  //   .finally(()=>setLoading(false));
  // }, []);
  useEffect(() => {
    Promise.all([
      agent.Store.list(currentPage, pageSize),
      agent.Store.brands(),
      agent.Store.types(),
    ])
      .then(([productsRes, brandsResp, typesResp]) => {
        setProducts(productsRes.content);
        setTotaItems(productsRes.totalElements);
        setBrands(brandsResp);
        setTypes(typesResp);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [currentPage, pageSize]);
  const loadProducts = (selectedSort: string, searchKeyword = "") => {
    setLoading(true);
    let page = currentPage - 1;
    let size = pageSize;
    let brandId = selectedBrandId !== 0 ? selectedBrandId : undefined;
    let typeId = selectedTypeId !== 0 ? selectedTypeId : undefined;
    const sort = "name";
    const order = selectedSort === "desc" ? "desc" : "asc";
    //construct the url
    let url = `${agent.Store.apiUrl}?sort=${sort}&order=${order}`;
    if (brandId !== undefined || typeId !== undefined) {
      url += "&";
      if (brandId !== undefined) url += `brandId=${brandId}&`;
      if (typeId !== undefined) url += `typeId=${typeId}&`;
      //Remove trailing &
      url = url.replace(/&$/, "");
    }
    //Make the API request with the url
    if (searchKeyword) {
      console.log(searchKeyword);
      agent.Store.search(searchKeyword)
        .then((productsRes) => {
          setProducts(productsRes.content);
          setTotaItems(productsRes.length);
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    } else {
      agent.Store.list(page, size, undefined, undefined, url)
        .then((productsRes) => {
          setProducts(productsRes.content);
          setTotaItems(productsRes.totalElements);
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  };
  //Trigger loadProducts wheneever selectedBrandId or selectedTypeId changes
  useEffect(() => {
    loadProducts(selectedSort);
  }, [selectedBrandId, selectedTypeId]);

  const handleSortChange = (event: any) => {
    const selectedSort = event.target.value;
    setSelectedSort(selectedSort);
    loadProducts(selectedSort);
  };

  const handleBrandChange = (event: any) => {
    const selectedBrand = event.target.value;
    const brand = brands.find((b) => b.name === selectedBrand);
    setSelectedBrand(selectedBrand);
    if (brand) {
      setSelectedBrandId(brand.id);
      loadProducts(selectedSort);
    }
  };

  const handleTypeChange = (event: any) => {
    const selectedType = event.target.value;
    const type = types.find((t) => t.name === selectedType);
    setSelectedType(selectedType);
    if (type) {
      setSelectedTypeId(type.id);
      loadProducts(selectedSort);
    }
  };
  const handlePageChange = (event: any, page: number) => {
    setCurrentPage(page);
  };

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  if (!products) return <h3>Unable to load Products</h3>;
  if (loading) return <Spinner message="Loading Products..." />;
  const filterPaperStyle = {
    mb: 3,
    p: 3,
    borderRadius: 3,
    bgcolor: (theme: any) =>
      theme.palette.mode === "light" ? "#f5f5f5" : "rgba(255, 255, 255, 0.05)",
    boxShadow: "none",
  };

  const filtersContent = (
    <>
      <Paper sx={filterPaperStyle}>
        <FormControl>
          <FormLabel
            id="sort-by-name-label"
            sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}
          >
            Sort by Name
          </FormLabel>
          <RadioGroup
            aria-label="sort-by-name"
            name="sort-by-name"
            value={selectedSort}
            onChange={handleSortChange}
          >
            {sortOptions.map(({ value, label }) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio color="secondary" />}
                label={label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Paper>
      <Paper sx={filterPaperStyle}>
        <FormControl>
          <FormLabel
            id="brands-label"
            sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}
          >
            Brands
          </FormLabel>
          <RadioGroup
            aria-label="brands"
            name="brands"
            value={selectedBrand}
            onChange={handleBrandChange}
          >
            {brands.map((brand) => (
              <FormControlLabel
                key={brand.id}
                value={brand.name}
                control={<Radio color="secondary" />}
                label={brand.name}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Paper>
      <Paper sx={filterPaperStyle}>
        <FormControl>
          <FormLabel
            id="types-label"
            sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}
          >
            Types
          </FormLabel>
          <RadioGroup
            aria-label="types"
            name="types"
            value={selectedType}
            onChange={handleTypeChange}
          >
            {types.map((type) => (
              <FormControlLabel
                key={type.id}
                value={type.name}
                control={<Radio color="secondary" />}
                label={type.name}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Paper>
    </>
  );

  return (
    <Box sx={{ pt: { xs: 4, md: 6 }, pb: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: "none",
            }}
          >
            <TextField
              label="Search products"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  loadProducts(selectedSort, searchTerm);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light"
                      ? "#f5f5f5"
                      : "rgba(255, 255, 255, 0.05)",
                },
              }}
            />
          </Paper>
          
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            {filtersContent}
          </Box>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              gap: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
              Displaying {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
            </Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<FilterListIcon />}
                onClick={() => setMobileFiltersOpen(true)}
                sx={{ display: { xs: "flex", md: "none" }, borderRadius: 8 }}
              >
                Filters
              </Button>
              <Pagination
                count={Math.ceil(totalItems / pageSize)}
                color="secondary"
                onChange={handlePageChange}
                page={currentPage}
                shape="rounded"
              />
            </Box>
          </Box>

          <ProductList products={products} />

          <Box mt={6} mb={2} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(totalItems / pageSize)}
              color="secondary"
              size="large"
              onChange={handlePageChange}
              page={currentPage}
              shape="rounded"
            />
          </Box>
        </Grid>
      </Grid>

      <Drawer
        anchor="right"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        PaperProps={{
          sx: { width: { xs: "85%", sm: 350 }, p: 3, pt: 4 },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Filters
          </Typography>
          <IconButton onClick={() => setMobileFiltersOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ overflowY: "auto", pb: 4 }}>
          {filtersContent}
        </Box>
      </Drawer>
    </Box>
  );
}
