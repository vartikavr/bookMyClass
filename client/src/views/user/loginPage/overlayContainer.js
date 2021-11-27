import "./overlayContainer.css";

const OverlayContainer = () => {
  return (
    <div className="overlayContainer">
      <div className="overlay">
        <div className="overlayPanel overlayLeft">
          <h1 className="heading">Welcome Back!</h1>
          <p className="text-content">
            To keep connected with us please login with your personal info
          </p>
          <button className="buttonLogin ghost" id="signIn">
            Sign In
          </button>
        </div>
        <div className="overlayPanel overlayRight">
          <h1 className="heading">Hello!</h1>
          <p className="text-content">
            Enter your details and get connected with us within seconds
          </p>
          <button className="buttonRegister ghost" id="signUp">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverlayContainer;
