// src/Pages/AccessPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './AccessPage.css';

import blessingStoreLogo from '../../assets/img/img-blessing-store.png';
import emailIcon from '../../assets/img/icon-email.svg';
import padlockIcon from '../../assets/img/icon-padlock.svg';
import userIcon from '../../assets/img/user.svg';
import phoneIcon from '../../assets/img/icon-phone.svg';
import addressIcon from '../../assets/img/icon-address.svg';
import calendarIcon from '../../assets/img/icon-calendar.svg';
import cityIcon from '../../assets/img/icon-city.svg';
import departmentIcon from '../../assets/img/icon-department.svg';
import googleIcon from '../../assets/img/google.svg';

function AccessPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('login');

    const [loginCorreo, setLoginCorreo] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    const [signupStep, setSignupStep] = useState(1);
    const [signupNombres, setSignupNombres] = useState('');
    const [signupApellidos, setSignupApellidos] = useState('');
    const [signupTelefono, setSignupTelefono] = useState('');
    const [signupDireccion, setSignupDireccion] = useState('');
    const [signupDepartamento, setSignupDepartamento] = useState('');
    const [signupCiudad, setSignupCiudad] = useState('');
    const [signupFechaNacimiento, setSignupFechaNacimiento] = useState('');
    const [signupCorreo, setSignupCorreo] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const [signupError, setSignupError] = useState('');
    const [signupSuccess, setSignupSuccess] = useState('');
    const [signupLoading, setLoadingSignup] = useState(false);
    const [signupFieldErrors, setSignupFieldErrors] = useState({});

    const [departments, setDepartments] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [departmentsError, setDepartmentsError] = useState('');
    const [citiesError, setCitiesError] = useState('');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordMinLength = 8;
    const phoneRegex = /^\d{7,10}$/;

    const validateField = useCallback((fieldName, value) => {
        let error = '';
        switch (fieldName) {
            case 'nombres':
                if (!value.trim()) error = 'Los nombres son obligatorios.';
                else if (!nameRegex.test(value)) error = 'Nombres solo pueden contener letras y espacios.';
                break;
            case 'apellidos':
                if (!value.trim()) error = 'Los apellidos son obligatorios.';
                else if (!nameRegex.test(value)) error = 'Apellidos solo pueden contener letras y espacios.';
                break;
            case 'correo':
                if (!value.trim()) error = 'El correo electrónico es obligatorio.';
                else if (!emailRegex.test(value)) error = 'Formato de correo electrónico inválido.';
                break;
            case 'password':
                if (!value) error = 'La contraseña es obligatoria.';
                else if (value.length < passwordMinLength) error = `La contraseña debe tener al menos ${passwordMinLength} caracteres.`;
                break;
            case 'confirmPassword':
                if (!value) error = 'Confirma tu contraseña.';
                else if (value !== signupPassword) error = 'Las contraseñas no coinciden.';
                break;
            case 'telefono':
                if (value && !phoneRegex.test(value)) error = 'Teléfono debe contener entre 7 y 10 dígitos numéricos.';
                break;
            case 'direccion':
                break;
            case 'departamento':
                if (!value) error = 'El departamento es obligatorio.';
                break;
            case 'ciudad':
                if (!value) error = 'La ciudad es obligatoria.';
                break;
            case 'fechaNacimiento':
                break;
            default:
                break;
        }
        return error;
    }, [signupPassword]);

    const fetchData = useCallback(async (url, setter, errorSetter, loadingSetter, transformData = (data) => data) => {
        loadingSetter(true);
        errorSetter('');
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            const result = await response.json();

            let dataToSet = [];
            if (typeof result === 'object' && result !== null && Array.isArray(result.data)) {
                dataToSet = result.data;
            } else if (Array.isArray(result)) {
                dataToSet = result;
            } else {
                throw new Error("La respuesta de la API no es un array válido ni un objeto con una propiedad 'data' que sea un array.");
            }

            setter(transformData(dataToSet));
        } catch (error) {
            console.error(`Error al cargar datos de ${url}:`, error);
            errorSetter(`No se pudieron cargar los datos: ${error.message}.`);
            setter([]);
        } finally {
            loadingSetter(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'signup' && signupStep === 4 && departments.length === 0 && !loadingDepartments && !departmentsError) {
            fetchData(
                `${API_BASE_URL}/api/ubicaciones/departamentos`,
                setDepartments,
                setDepartmentsError,
                setLoadingDepartments,
                (data) => data.map(dep => ({ Id_Departamento: dep.id, Nombre_Departamento: dep.nombre }))
            );
        }
    }, [API_BASE_URL, activeTab, signupStep, departments.length, loadingDepartments, departmentsError, fetchData]);

    useEffect(() => {
        if (activeTab === 'signup' && signupStep === 4 && signupDepartamento) {
            const currentDepartmentId = signupDepartamento;

            const loadCities = async () => {
                setCities([]);
                setSignupCiudad('');
                setCitiesError('');
                setLoadingCities(true);

                try {
                    const response = await fetch(`${API_BASE_URL}/api/ubicaciones/municipios?departamentoId=${currentDepartmentId}`);
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                    }
                    const result = await response.json();

                    let dataToSet = [];
                    if (typeof result === 'object' && result !== null && Array.isArray(result.data)) {
                        dataToSet = result.data;
                    } else if (Array.isArray(result)) {
                        dataToSet = result;
                    } else {
                        throw new Error("La respuesta de la API no es un array válido ni un objeto con una propiedad 'data' que sea un array.");
                    }
                    setCities(dataToSet.map(city => ({ Id_Ciudad: city.id, Nombre_Ciudad: city.nombre })));
                    setCitiesError('');
                } catch (error) {
                    console.error(`Error al cargar ciudades para el departamento ${currentDepartmentId}:`, error);
                    setCitiesError(`No se pudieron cargar las ciudades: ${error.message}.`);
                    setCities([]);
                } finally {
                    setLoadingCities(false);
                }
            };

            if (currentDepartmentId && !loadingCities) {
                loadCities();
            }

        } else if (activeTab === 'signup' && signupStep === 4 && !signupDepartamento) {
            setCitiesError('Selecciona un departamento para cargar las ciudades.');
            setCities([]);
            setSignupCiudad('');
        }
    }, [API_BASE_URL, activeTab, signupStep, signupDepartamento, setLoadingCities, setCities, setCitiesError, setSignupCiudad]);

    const handleSignupInputChange = (e, setter, fieldName) => {
        const { value } = e.target;
        setter(value);

        setSignupFieldErrors(prev => ({
            ...prev,
            [fieldName]: validateField(fieldName, value)
        }));

        if (fieldName === 'password' || fieldName === 'confirmPassword') {
            const newErrors = { ...signupFieldErrors };
            newErrors.password = validateField('password', fieldName === 'password' ? value : signupPassword);
            newErrors.confirmPassword = validateField('confirmPassword', fieldName === 'confirmPassword' ? value : signupConfirmPassword);
            setSignupFieldErrors(newErrors);
        }
    };

    const validateStep = (step) => {
        let errors = {};
        let fieldsToValidate = [];

        if (step === 1) {
            fieldsToValidate = ['nombres', 'apellidos', 'correo'];
        } else if (step === 2) {
            fieldsToValidate = ['password', 'confirmPassword'];
        } else if (step === 3) {
            fieldsToValidate = ['telefono', 'direccion', 'fechaNacimiento'];
            if (signupTelefono && !phoneRegex.test(signupTelefono)) {
                errors.telefono = 'Teléfono debe contener entre 7 y 10 dígitos numéricos.';
            }
        } else if (step === 4) {
            fieldsToValidate = ['departamento', 'ciudad'];
        }

        fieldsToValidate.forEach(field => {
            let value;
            switch (field) {
                case 'nombres': value = signupNombres; break;
                case 'apellidos': value = signupApellidos; break;
                case 'correo': value = signupCorreo; break;
                case 'password': value = signupPassword; break;
                case 'confirmPassword': value = signupConfirmPassword; break;
                case 'telefono': value = signupTelefono; break;
                case 'direccion': value = signupDireccion; break;
                case 'departamento': value = signupDepartamento; break;
                case 'ciudad': value = signupCiudad; break;
                case 'fechaNacimiento': value = signupFechaNacimiento; break;
                default: break;
            }
            const error = validateField(field, value);
            if (error) {
                errors[field] = error;
            }
        });

        setSignupFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle Login Form Submission
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        if (!loginCorreo.trim()) {
            setLoginError('El correo electrónico es obligatorio.');
            setLoginLoading(false);
            return;
        }
        if (!loginPassword.trim()) {
            setLoginError('La contraseña es obligatoria.');
            setLoginLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    correo: loginCorreo,
                    password: loginPassword,
                }),
            });

            const data = await response.json();
            console.log('Respuesta COMPLETA del backend después del login (en AccessPage):', data);
            console.log('Propiedad "user" de la respuesta del backend (en AccessPage):', data.user);

            if (response.ok) {
                console.log('Login exitoso:', data);
                login({ user: data.user, token: data.token });
                navigate('/');
            } else {
                setLoginError(data.message || 'Credenciales incorrectas. Intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error de red al iniciar sesión:', error);
            setLoginError('No se pudo conectar con el servidor. Verifica tu conexión e inténtalo más tarde.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleSignupSubmitOrNext = async (e) => {
        e.preventDefault();
        setSignupError('');
        setSignupSuccess('');

        const isValid = validateStep(signupStep);

        if (!isValid) {
            setSignupError('Por favor, corrige los errores en el formulario.');
            return;
        }

        if (signupStep < 4) {
            setSignupStep(prev => prev + 1);
        } else {
            setLoadingSignup(true);

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombres: signupNombres,
                        apellidos: signupApellidos,
                        telefono: signupTelefono || null,
                        direccion: signupDireccion || null,
                        id_ciudad: signupCiudad,
                        fecha_nacimiento: signupFechaNacimiento || null,
                        correo: signupCorreo,
                        password: signupPassword,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setSignupSuccess(data.message || '¡Registro exitoso! Ya puedes iniciar sesión.');
                    setActiveTab('login'); // Vuelve a la pestaña de login
                    setLoginCorreo(signupCorreo); // Pre-rellena el email para el login
                    // Reset all signup form fields
                    setSignupNombres('');
                    setSignupApellidos('');
                    setSignupTelefono('');
                    setSignupDireccion('');
                    setSignupDepartamento('');
                    setSignupCiudad('');
                    setSignupFechaNacimiento('');
                    setSignupCorreo('');
                    setSignupPassword('');
                    setSignupConfirmPassword('');
                    setSignupStep(1);
                    setSignupFieldErrors({});
                    setDepartments([]);
                    setCities([]);
                } else {
                    setSignupError(data.message || 'Error al registrar. Revisa los datos e intenta de nuevo.');
                }
            } catch (error) {
                console.error('Error de red al registrar:', error);
                setSignupError('No se pudo conectar con el servidor. Intenta más tarde.');
            } finally {
                setLoadingSignup(false);
            }
        }
    };

    return (
        <>
            <div className="access-top-bar"></div>

            <main className="access-container">
                <section className="access-left-section">
                    <img src={blessingStoreLogo} alt="Logo: Blessing Store" className="access-logo" />
                    <div className="access-heading-container">
                        <div className={`access-heading-login-container ${activeTab === 'login' ? 'active' : ''}`}>
                            <h1>Inicia sesión en<br />tu cuenta</h1>
                        </div>
                        <div className={`access-heading-signup-container ${activeTab === 'signup' ? 'active' : ''}`}>
                            <h1>Crea una<br />cuenta</h1>
                        </div>
                    </div>
                    <p className="access-slogan">Blessing Store</p>
                </section>

                <section className="access-right-section">
                    <div className="access-form-wrapper">
                        <div className="access-form-header">
                            <label
                                onClick={() => { setActiveTab('login'); setSignupStep(1); setSignupError(''); setSignupSuccess(''); setLoginError(''); setSignupFieldErrors({}); }}
                                className={activeTab === 'login' ? 'access-active-tab' : ''}
                            >
                                Iniciar sesión
                            </label>
                            <label
                                onClick={() => { setActiveTab('signup'); setSignupStep(1); setLoginError(''); setSignupError(''); setSignupSuccess(''); setSignupFieldErrors({}); }}
                                className={activeTab === 'signup' ? 'access-active-tab' : ''}
                            >
                                Crear cuenta
                            </label>
                        </div>

                        {loginError && activeTab === 'login' && <p className="access-error-message">{loginError}</p>}
                        {signupError && activeTab === 'signup' && <p className="access-error-message">{signupError}</p>}
                        {signupSuccess && activeTab === 'signup' && <p className="access-success-message">{signupSuccess}</p>}

                        {/* Login Form */}
                        {activeTab === 'login' && (
                            <form className="access-form-content access-form-login active-form" onSubmit={handleLoginSubmit}>
                                <div className="access-input-group">
                                    <img src={emailIcon} alt="Email icon" className="access-input-icon" />
                                    <input
                                        type="email"
                                        placeholder="Correo electrónico"
                                        required
                                        value={loginCorreo}
                                        onChange={(e) => setLoginCorreo(e.target.value)}
                                    />
                                </div>
                                <div className="access-input-group">
                                    <img src={padlockIcon} alt="Password icon" className="access-input-icon" />
                                    <input
                                        type="password"
                                        placeholder="Contraseña"
                                        required
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="access-submit-button" disabled={loginLoading}>
                                    {loginLoading ? 'Ingresando...' : 'Ingresar'}
                                </button>
                                <div className="access-or-separator">O</div>
                                <div className="access-social-login">
                                    <a href="#" className="access-social-button">
                                        <img src={googleIcon} alt="Google icon" className="access-social-icon" /> Iniciar con Google
                                    </a>
                                </div>
                            </form>
                        )}

                        {/* Signup Form */}
                        {activeTab === 'signup' && (
                            <form className="access-form-content access-form-signup active-form" onSubmit={handleSignupSubmitOrNext}>
                                {signupStep === 1 && (
                                    <>
                                        <div className="access-input-group">
                                            <img src={userIcon} alt="User icon" className="access-input-icon" />
                                            <input
                                                type="text"
                                                placeholder="Nombres"
                                                required
                                                value={signupNombres}
                                                onChange={(e) => handleSignupInputChange(e, setSignupNombres, 'nombres')}
                                            />
                                        </div>
                                        {signupFieldErrors.nombres && <p className="access-field-error">{signupFieldErrors.nombres}</p>}

                                        <div className="access-input-group">
                                            <img src={userIcon} alt="User icon" className="access-input-icon" />
                                            <input
                                                type="text"
                                                placeholder="Apellidos"
                                                required
                                                value={signupApellidos}
                                                onChange={(e) => handleSignupInputChange(e, setSignupApellidos, 'apellidos')}
                                            />
                                        </div>
                                        {signupFieldErrors.apellidos && <p className="access-field-error">{signupFieldErrors.apellidos}</p>}

                                        <div className="access-input-group">
                                            <img src={emailIcon} alt="Email icon" className="access-input-icon" />
                                            <input
                                                type="email"
                                                placeholder="Correo electrónico"
                                                required
                                                value={signupCorreo}
                                                onChange={(e) => handleSignupInputChange(e, setSignupCorreo, 'correo')}
                                            />
                                        </div>
                                        {signupFieldErrors.correo && <p className="access-field-error">{signupFieldErrors.correo}</p>}

                                    </>
                                )}

                                {signupStep === 2 && (
                                    <>
                                        <div className="access-input-group">
                                            <img src={padlockIcon} alt="Password icon" className="access-input-icon" />
                                            <input
                                                type="password"
                                                placeholder="Contraseña"
                                                required
                                                value={signupPassword}
                                                onChange={(e) => handleSignupInputChange(e, setSignupPassword, 'password')}
                                            />
                                        </div>
                                        {signupFieldErrors.password && <p className="access-field-error">{signupFieldErrors.password}</p>}

                                        <div className="access-input-group">
                                            <img src={padlockIcon} alt="Confirm Password icon" className="access-input-icon" />
                                            <input
                                                type="password"
                                                placeholder="Confirmar Contraseña"
                                                required
                                                value={signupConfirmPassword}
                                                onChange={(e) => handleSignupInputChange(e, setSignupConfirmPassword, 'confirmPassword')}
                                            />
                                        </div>
                                        {signupFieldErrors.confirmPassword && <p className="access-field-error">{signupFieldErrors.confirmPassword}</p>}
                                    </>
                                )}

                                {signupStep === 3 && (
                                    <>
                                        <div className="access-input-group">
                                            <img src={phoneIcon} alt="Phone icon" className="access-input-icon" />
                                            <input
                                                type="tel"
                                                placeholder="Teléfono"
                                                value={signupTelefono}
                                                onChange={(e) => handleSignupInputChange(e, setSignupTelefono, 'telefono')}
                                                maxLength="10"
                                            />
                                        </div>
                                        {signupFieldErrors.telefono && <p className="access-field-error">{signupFieldErrors.telefono}</p>}

                                        <div className="access-input-group">
                                            <img src={addressIcon} alt="Address icon" className="access-input-icon" />
                                            <input
                                                type="text"
                                                placeholder="Dirección"
                                                value={signupDireccion}
                                                onChange={(e) => handleSignupInputChange(e, setSignupDireccion, 'direccion')}
                                            />
                                        </div>
                                        {signupFieldErrors.direccion && <p className="access-field-error">{signupFieldErrors.direccion}</p>}

                                        <div className="access-input-group">
                                            <img src={calendarIcon} alt="Date of Birth icon" className="access-input-icon" />
                                            <input
                                                type="date"
                                                placeholder="Fecha de Nacimiento"
                                                value={signupFechaNacimiento}
                                                onChange={(e) => handleSignupInputChange(e, setSignupFechaNacimiento, 'fechaNacimiento')}
                                            />
                                        </div>
                                        {signupFieldErrors.fechaNacimiento && <p className="access-field-error">{signupFieldErrors.fechaNacimiento}</p>}
                                    </>
                                )}

                                {signupStep === 4 && (
                                    <>
                                        {/* Department Field */}
                                        <div className="access-input-group">
                                            <img src={departmentIcon} alt="Department icon" className="access-input-icon" />
                                            <select
                                                value={signupDepartamento}
                                                onChange={(e) => handleSignupInputChange(e, setSignupDepartamento, 'departamento')}
                                                required
                                                disabled={loadingDepartments}
                                            >
                                                <option value="">
                                                    {loadingDepartments ? 'Cargando departamentos...' : (departmentsError ? `Error: ${departmentsError}` : 'Departamento')}
                                                </option>
                                                {departments.length > 0 && departments.map((dep) => (
                                                    <option key={dep.Id_Departamento} value={dep.Id_Departamento}>
                                                        {dep.Nombre_Departamento}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {signupFieldErrors.departamento && <p className="access-field-error">{signupFieldErrors.departamento}</p>}

                                        {/* City Field (dependent on department) */}
                                        <div className="access-input-group">
                                            <img src={cityIcon} alt="City icon" className="access-input-icon" />
                                            <select
                                                value={signupCiudad}
                                                onChange={(e) => handleSignupInputChange(e, setSignupCiudad, 'ciudad')}
                                                required
                                                disabled={loadingCities || !signupDepartamento}
                                            >
                                                <option value="">
                                                    {!signupDepartamento ? 'Primero selecciona un departamento' : (loadingCities ? 'Cargando ciudades...' : (citiesError ? `Error: ${citiesError}` : 'Selecciona tu ciudad'))}
                                                </option>
                                                {cities.length > 0 && cities.map((city) => (
                                                    <option key={city.Id_Ciudad} value={city.Id_Ciudad}>
                                                        {city.Nombre_Ciudad}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {signupFieldErrors.ciudad && <p className="access-field-error">{signupFieldErrors.ciudad}</p>}
                                    </>
                                )}

                                <div className="access-form-navigation">
                                    {signupStep > 1 && (
                                        <button type="button" className="access-prev-button" onClick={() => setSignupStep(prev => prev - 1)}>
                                            Atrás
                                        </button>
                                    )}
                                    <button type="submit" className="access-submit-button" disabled={signupLoading}>
                                        {signupStep < 4 ? 'Siguiente' : (signupLoading ? 'Registrando...' : 'Registrarse')}
                                    </button>
                                </div>
                            </form>
                        )}
                        <nav className="access-footer-links">
                            <Link to="/sobre-nosotros">Acerca de</Link>
                            <Link to="/contacto">Ayuda</Link>
                            <Link to="/preguntas-frecuentes">Más</Link>
                        </nav>
                    </div>
                </section>
            </main>
        </>
    );
}

export default AccessPage;