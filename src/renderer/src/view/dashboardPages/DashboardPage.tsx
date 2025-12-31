import { Typography, Grid, Paper, Box } from '@mui/material';

const DashboardPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        ERP Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Example cards like in the image */}
         <Grid size={{xs:12, md:4}}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6">Total Sales</Typography>
            <Typography component="p" variant="h4">
              $3,523,054
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{xs:12, md:4}}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6">Total Products</Typography>
            <Typography component="p" variant="h4">
              400
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
