import * as React from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import Popper from "@mui/material/Popper";
import { useTheme, styled } from "@mui/material/styles";
import { VariableSizeList } from "react-window";
import Typography from "@mui/material/Typography";
import { Chip } from "@mui/material";

export default function DropdownWithSearch({
  options,
  onSelect,
  label = "",
  value,
  setValue,
  // setFilterType,
}) {
  const LISTBOX_PADDING = 8;

  function renderRow(props) {
    const { data, index, style } = props;
    const dataSet = data[index];

    return (
      <Typography component="li" {...dataSet[0]} style={style} noWrap>
        {`${dataSet[1]}`}
      </Typography>
    );
  }

  const OuterElementContext = React.createContext({});

  const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
  });

  OuterElementContext.displayName = "OuterElementContext";

  OuterElementType.displayName = "OuterElementType";

  function useResetCache(data) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (ref.current != null) {
        ref.current.resetAfterIndex(0, true);
      }
    }, [data]);
    return ref;
  }

  const ListboxComponent = React.forwardRef(function ListboxComponent(
    props,
    ref
  ) {
    const { children, ...other } = props;
    const itemData = [];
    children.forEach((item) => {
      itemData.push(item);
      itemData.push(...(item.children || []));
    });

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
      noSsr: true,
    });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child) => {
      if (child.hasOwnProperty("group")) {
        return 48;
      }
      return itemSize;
    };

    const getHeight = () => {
      if (itemCount > 8) {
        return 8 * itemSize;
      }
      return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            itemData={itemData}
            height={getHeight() + 2 * LISTBOX_PADDING}
            width="100%"
            ref={gridRef}
            outerElementType={OuterElementType}
            innerElementType="ul"
            itemSize={(index) => getChildSize(itemData[index])}
            overscanCount={5}
            itemCount={itemCount}
          >
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  });

  ListboxComponent.propTypes = {
    children: PropTypes.node,
  };

  const StyledPopper = styled(Popper)(({ theme }) => ({
    [`& .${autocompleteClasses.listbox}`]: {
      boxSizing: "border-box",
      backgroundColor: theme.colors.lightBackgroundColor,
      color: theme.colors.textColor,
      "& ul": {
        padding: 0,
        margin: 0,
      },
    },
  }));

  React.useEffect(() => {
    onSelect(value);
  }, [value]);

  const handleInputChange = (event, newValue) => {
    setValue(newValue);
    // setFilterType(label);
  };

  const theme = useTheme();
  return (
    <Autocomplete
      multiple
      limitTags={2}
      sx={{ width: "100%" }}
      disableListWrap
      disableCloseOnSelect
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      value={value}
      onChange={handleInputChange}
      options={options}
      isOptionEqualToValue={(option, value) =>
        option.option === value.option && option.label === value.label
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            type: "search",
            sx: {
              color: theme.colors.textColor, // Text color
              backgroundColor: theme.colors.lightBackgroundColor, // Input background color
            },
          }}
          InputLabelProps={{
            sx: { color: theme.colors.textColor }, // Label text color
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#666", // Border color
              },
              "&:hover fieldset": {
                borderColor: "#888", // Hovered border color
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.colors.textColor, // Focused border color
              },
            },
          }}
        />
      )}
      renderTags={(tagValue, getTagProps) => {
        return tagValue.map((option, index) => {
          const { key, ...rest } = getTagProps({ index });
          return (
            <Chip
              {...rest}
              key={option?.option}
              label={option?.label}
              style={{
                color: theme.colors.textColor, // Text color
                backgroundColor: "#666", // Chip background color
              }}
            />
          );
        });
      }}
      renderOption={(props, option, state) => {
        const { key, ...rest } = props;
        return [rest, option?.label, state.index];
      }}
    />
  );
}
