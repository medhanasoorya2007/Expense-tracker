/**
 * components/Loader.jsx
 *
 * Versatile spinner component.
 *
 * Props:
 *   fullPage {boolean} – true  → full-screen overlay spinner
 *                        false → small inline spinner (default)
 */

function Loader({ fullPage = false }) {
  if (fullPage) {
    return (

      <div className="loader-container">
        <div className="loader">
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>

        </div>
      </div>

    );
  }

  return (

    <div className="loader-container">
      <div className="loader">
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>

      </div>
    </div>

  );
}

export default Loader;
