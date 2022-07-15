import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';

function Home() {
  return (
    <Paper>
      <Card>
        <CardHeader
          title="Card Header"
        />
        <CardContent>
          <Typography>Card Content</Typography>
        </CardContent>
        <CardActionArea>
        <Typography>Card Action Area</Typography>
        </CardActionArea>
      </Card>
    </Paper>
  );
}

export default Home;