import {
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import List from "@mui/material/List";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../service/config";

import { v4 as uuidv4 } from "uuid";

import { Search } from "@mui/icons-material";
import { useSelector } from "react-redux";
import FlexBetween from "../CustomStyledComponents/FlexBetween";
import UserAvatar from "../CustomStyledComponents/UserAvatar";

const SearchBar = ({isMobileScreen}) => {
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const token = useSelector((state) => state.token);

  const navigate = useNavigate();

  const handleClose = async () => {
    setTimeout(() => {
      setIsListOpen(false);
      setIsClosed(true);
    }, 500);
  };

  const handleClick = async (username, e) => {
    e.preventDefault();
    navigate(`/profile/${username}`);
    navigate(0);
  };

  const getSuggestions = async () => {
    const responseData = await fetch(
      `${SERVER_URL}u?searchInput=${searchInput}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }
    );
    if (responseData.ok) {
      const data = await responseData.json();
      setLoading(false);
      setSuggestions(data);
    } else {
      setLoading(false);
      setSuggestions([]);
    }
  };

  const handleSearchClick = () => {
    if (searchInput.length) {
      getSuggestions();
      setIsListOpen(true);
    }
  };

  const handleChange = (event) => {
    setLoading(true);
    setSearchInput(event.target.value);
    if (searchInput.trim().length > 0) {
      setIsListOpen(true);
    } else {
      setIsListOpen(false);
    }
  };

  useEffect(() => {
    if (isListOpen) {
      if (searchInput.trim().length > 0) {
        getSuggestions();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    if (isListOpen && isClosed) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClosed]);

  const { palette } = useTheme();
  const { main, medium, light: neutralLight } = palette.neutral;
  const bg = palette.background.alt;

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        width: isMobileScreen ? "180px" : null
      }}
    >
      <FlexBetween
        backgroundColor={neutralLight}
        borderRadius="9px"
        gap="3rem"
        padding="0.1rem 1.5rem"
      >
        <InputBase
          onBlur={handleClose}
          value={searchInput}
          onChange={handleChange}
          placeholder="Search..."
        />
        <IconButton onClick={handleSearchClick}>
          <Search />
        </IconButton>
      </FlexBetween>

      {isListOpen ? (
        <List
          id="search-list"
          sx={{
            overflow: "visible",
            position: "absolute",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            bgcolor: bg,
            mt: 5.8,
            width: "250px",
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: "50%",
              left: "50%",
              width: 10,
              height: 10,
              bgcolor: bg,
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          }}
        >
          {suggestions.length ? (
            suggestions.map(({ username, profilePhotoUrl, occupation }, i) => (
              <MenuItem
                key={uuidv4()}
                onClick={(e) => handleClick(username, e)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: neutralLight,
                    borderRadius: "0.8rem",
                  },
                }}
              >
                <FlexBetween gap="1rem">
                  <UserAvatar image={profilePhotoUrl[0]?.url ? profilePhotoUrl[0].url : 'https://i.stack.imgur.com/l60Hf.png'} size="32px" />
                  <Box>
                    <Typography color={main} variant="h5" fontWeight="500">
                      {username.length > 17
                        ? `${username.substring(0, 17)}...`
                        : username}
                    </Typography>
                    <Typography color={medium} fontSize="0.75rem">
                      {occupation.length > 17
                        ? `${occupation.substring(0, 17)}...`
                        : occupation}
                    </Typography>
                  </Box>
                </FlexBetween>
              </MenuItem>
            ))
          ) : (
            <MenuItem
              sx={{
                cursor: "default",
                display: "flex",
                justifyContent: "center",
                height: "200px",
              }}
            >
              {loading ? (
                <CircularProgress />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No Results
                </Typography>
              )}
            </MenuItem>
          )}
        </List>
      ) : null}
    </Box>
  );
};

export default SearchBar;
