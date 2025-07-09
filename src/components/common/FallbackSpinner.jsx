import PropTypes from "prop-types";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#813CF0",
};

const FallbackSpinner = ({ bgColor = "#1D2022" }) => {
  const isLoading = true;

  return (
    <div
      className={`min-h-screen flex items-center justify-center`}
      style={{ backgroundColor: bgColor }}
    >
      <ClipLoader
        color="#fff"
        loading={isLoading}
        cssOverride={override}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

FallbackSpinner.propTypes = {
  bgColor: PropTypes.string,
};

export default FallbackSpinner;
