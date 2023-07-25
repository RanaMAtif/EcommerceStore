import * as React from "react";
import footer from "../../Images/footer.png";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import Input from "@mui/joy/Input";
import List from "@mui/joy/List";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import SendIcon from "@mui/icons-material/Send";

export default function Footer() {
  return (
    <Sheet
      variant="solid"
      color={"primary"}
      invertedColors
      sx={{
        ...{
          bgcolor: `${"primary"}.800`,
        },
        flexGrow: 1,
        p: 1,
        mx: 0,
        my: 0,
        borderRadius: { xs: 0, sm: "xs" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Divider orientation="vertical" />
        <IconButton variant="plain">
          <FacebookRoundedIcon />
        </IconButton>
        <IconButton variant="plain">
          <GitHubIcon />
        </IconButton>
        <Input
          variant="soft"
          placeholder="Your Email"
          type="email"
          name="email"
          endDecorator={
            <Button variant="soft" aria-label="subscribe">
              <SendIcon />
            </Button>
          }
          sx={{ ml: "auto", display: { xs: "none", md: "flex" } }}
        />
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "flex-start" },
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Card
          variant="soft"
          size="sm"
          sx={{
            flexDirection: { xs: "row", md: "column" },
            minWidth: { xs: "100%", md: "auto" },
            gap: 1,
          }}
        >
          <AspectRatio
            ratio="20/10"
            minHeight={80}
            sx={{ flexBasis: { xs: 200, md: "initial" } }}
          >
            <img alt="Powerstore Logo" src={footer} />
          </AspectRatio>
          <CardContent>
            <Typography level="body2">
              Powerstore where we sell and buy together
            </Typography>
          </CardContent>
        </Card>
        <List
          size="sm"
          orientation="horizontal"
          wrap
          sx={{ flexGrow: 0, "--ListItem-radius": "8px" }}
        >
          <ListItem nested sx={{ width: { xs: "50%", md: 140 } }}>
            <ListSubheader>Customer Care</ListSubheader>
            <List>
              <ListItem>
                <ListItemButton>Contact us</ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton>About us</ListItemButton>
              </ListItem>
            </List>
          </ListItem>
        </List>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          level="body2"
          startDecorator={<Typography textColor="text.tertiary">by</Typography>}
        >
          Powerstore
        </Typography>

        <Typography level="body3" sx={{ ml: "auto" }}>
          Copyright 2023
        </Typography>
      </Box>
    </Sheet>
  );
}
