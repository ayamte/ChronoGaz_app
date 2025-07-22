import { useState } from "react"  
import "./login.css"  
import backgroundLogin from "../../assets/background_login.png";  
  
export function LoginForm({ className = "", ...props }) {  
  const [formData, setFormData] = useState({  
    email: "",  
    password: ""  
  })  
  
  const handleInputChange = (e) => {  
    const { name, value } = e.target  
    setFormData(prev => ({  
      ...prev,  
      [name]: value  
    }))  
  }  
  
  const handleSubmit = (e) => {  
    e.preventDefault()  
    console.log("Login attempt:", formData)  
  }  
  
  return (  
  <div className={`login-page-background`}>  
    <div className={`login-form-container ${className}`} {...props}> 
      <div className="login-card">  
        <div className="login-card-content">  
          <form className="login-form" onSubmit={handleSubmit}>  
            <div className="login-form-inner">  
              <div className="login-header">  
                <h1 className="login-title">Welcome back</h1>  
                <p className="login-subtitle">Login to your ChronoGaz account</p>  
              </div>  
                
              <div className="login-field">  
                <label htmlFor="email" className="login-label">Email</label>  
                <input   
                  id="email"   
                  name="email"  
                  type="email"   
                  placeholder="m@example.com"   
                  value={formData.email}  
                  onChange={handleInputChange}  
                  className="login-input"  
                  required   
                />  
              </div>  
                
              <div className="login-field">  
                <div className="login-password-header">  
                  <label htmlFor="password" className="login-label">Password</label>  
                  <button type="button" className="login-forgot-link">  
                    Forgot your password?  
                  </button>  
                </div>  
                <input   
                  id="password"   
                  name="password"  
                  type="password"   
                  value={formData.password}  
                  onChange={handleInputChange}  
                  className="login-input"  
                  required   
                />  
              </div>  
                
              <button type="submit" className="login-submit-button">  
                Login  
              </button>  
                
              <div className="login-divider">  
                <span className="login-divider-text">Or continue with</span>  
              </div>  
                
              <div className="login-social-buttons">  
                <button type="button" className="login-social-button">  
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="login-social-icon">  
                    <path  
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"  
                      fill="currentColor"  
                    />  
                  </svg>  
                  <span className="login-sr-only">Login with Google</span>  
                </button>  
              </div>  
                
              <div className="login-signup-link">  
                Don't have an account?{" "}  
                <button type="button" className="login-signup-anchor">  
                  Sign up  
                </button>  
              </div>  
            </div>  
          </form>  
            
          <div className="login-background-section">  
            <img  
              src={backgroundLogin}  
              alt="Login Background"  
              className="login-background-image"  
            />  
          </div>  
        </div>  
      </div>  
        
      <div className="login-terms">  
        By clicking continue, you agree to our <button type="button">Terms of Service</button> and <button type="button">Privacy Policy</button>.  
      </div>  
    </div>  
    </div>  
  )  
}  
  
export default LoginForm