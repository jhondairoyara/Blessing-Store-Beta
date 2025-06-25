// src/pages/ProfilePage/ProfilePage.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import userIcon from '../../assets/img/user.svg';
import emailIcon from '../../assets/img/icon-email.svg';
import phoneIcon from '../../assets/img/icon-phone.svg';
import addressIcon from '../../assets/img/icon-address.svg';
import calendarIcon from '../../assets/img/icon-calendar.svg';
import cityIcon from '../../assets/img/icon-city.svg';
import departmentIcon from '../../assets/img/icon-department.svg';
import padlockIcon from '../../assets/img/icon-padlock.svg';

function ProfilePage() {
    const { user, token, logout, updateUserContext } = useAuth();
    const navigate = useNavigate(); // Inicializa useNavigate
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    const [profileData, setProfileData] = useState({
        Nombres: '',
        Apellidos: '',
        Telefono: '',
        Direccion: '',
        Id_Ciudad: '', 
        Id_Departamento: '', 
        Fecha_Nacimiento: '',
        Correo_Electronico: '',
        Nombre_Ciudad: '',
        Nombre_Departamento: ''
    });

    const [initialProfileData, setInitialProfileData] = useState({});


    const [editMode, setEditMode] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingPasswordChange, setLoadingPasswordChange] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    const [departments, setDepartments] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [departmentsError, setDepartmentsError] = useState('');
    const [citiesError, setCitiesError] = useState('');

    const loadedDepartmentIdRef = useRef(null);

    const fetchDataFromApi = useCallback(async (url, transformData = (data) => data, errorSetter, loadingSetter) => {
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
            } else if (result && (result.id || result.Id_Departamento || result.Id_Ciudad)) {
                dataToSet = [result];
            } else {
                throw new Error("La respuesta de la API no es un array válido, ni un objeto con 'data', ni un objeto de ubicación directa.");
            }
            return transformData(dataToSet);
        } catch (error) {
            console.error(`Error al cargar datos de ${url}:`, error);
            errorSetter(`No se pudieron cargar los datos: ${error.message}.`);
            return [];
        } finally {
            loadingSetter(false);
        }
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user || !token) {
                setProfileMessage({ type: 'error', text: 'No estás autenticado.' });
                setLoadingProfile(false);
                return;
            }

            setLoadingProfile(true);
            setProfileMessage({ type: '', text: '' });
            try {
                const response = await fetch(`${API_BASE_URL}/api/usuarios/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 401) {
                        logout();
                        setProfileMessage({ type: 'error', text: 'Sesión expirada. Por favor, inicia sesión de nuevo.' });
                        return;
                    }
                    throw new Error(errorData.message || 'Error al cargar el perfil.');
                }

                const data = await response.json();

                // Formatear Fecha_Nacimiento para input type="date"
                if (data.Fecha_Nacimiento) {
                    data.Fecha_Nacimiento = new Date(data.Fecha_Nacimiento).toISOString().split('T')[0];
                }

                // Convertir los IDs de ciudad/departamento a String para los selectores
                const transformedData = {
                    ...data,
                    Id_Departamento: data.Id_Departamento ? String(data.Id_Departamento) : '',
                    Id_Ciudad: data.Id_Ciudad ? String(data.Id_Ciudad) : '',
                    // Asegurar que los nombres de ciudad/departamento se muestren
                    Nombre_Ciudad: data.Nombre_Ciudad || '',
                    Nombre_Departamento: data.Nombre_Departamento || ''
                };

                setProfileData(transformedData);
                // Almacenar una copia de los datos originales para comparar cambios
                setInitialProfileData(transformedData);

                // Configurar la referencia del departamento cargado para evitar recargas innecesarias
                loadedDepartmentIdRef.current = transformedData.Id_Departamento || null;

            } catch (error) {
                console.error('Error fetching profile:', error);
                setProfileMessage({ type: 'error', text: error.message || 'Error al cargar el perfil. Intenta de nuevo.' });
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchUserProfile();
    }, [user, token, API_BASE_URL, logout]);

    // Effect para cargar departamentos
    useEffect(() => {
        const shouldLoadDepartments =
            (editMode && departments.length === 0 && !loadingDepartments && !departmentsError) ||
            (profileData.Id_Departamento && departments.length === 0 && !loadingDepartments && !departmentsError);

        if (shouldLoadDepartments) {
            const loadDepartments = async () => {
                const fetchedDeps = await fetchDataFromApi(
                    `${API_BASE_URL}/api/ubicaciones/departamentos`,
                    (data) => data.map(dep => ({ Id_Departamento: String(dep.id), Nombre_Departamento: dep.nombre })),
                    setDepartmentsError,
                    setLoadingDepartments
                );
                setDepartments(fetchedDeps);
            };
            loadDepartments();
        }
    }, [API_BASE_URL, editMode, departments.length, loadingDepartments, departmentsError, fetchDataFromApi, profileData.Id_Departamento]);


    // Effect para cargar ciudades basado en el departamento seleccionado/existente
    useEffect(() => {
        const currentDepartmentId = profileData.Id_Departamento;

        const loadCitiesForDepartment = async () => {
            const shouldLoad = (editMode && currentDepartmentId) ||
                               (profileData.Id_Ciudad && currentDepartmentId && cities.length === 0 && !loadingCities && !citiesError);

            if (!shouldLoad) {
                setCities([]); // Limpiar ciudades si no hay departamento o no estamos en modo edición
                setCitiesError('');
                loadedDepartmentIdRef.current = null; 
                return;
            }

            // Solo cargar si el departamento actual es diferente al que ya cargamos ciudades
            if (currentDepartmentId !== loadedDepartmentIdRef.current) {
                setCities([]); // Limpiar ciudades anteriores
                setCitiesError('');

                try {
                    const fetchedCities = await fetchDataFromApi(
                        `${API_BASE_URL}/api/ubicaciones/municipios?departamentoId=${currentDepartmentId}`,
                        (data) => data.map(city => ({ Id_Ciudad: String(city.id), Nombre_Ciudad: city.nombre })),
                        setCitiesError,
                        setLoadingCities
                    );
                    setCities(fetchedCities);
                    loadedDepartmentIdRef.current = currentDepartmentId; // Almacenar el ID del departamento para el que se cargaron las ciudades
                } catch (error) {
                    console.error('Error al cargar ciudades para el departamento:', error);
                    loadedDepartmentIdRef.current = null; // En caso de error, resetear
                }
            }
        };

        const handler = setTimeout(() => {
            loadCitiesForDepartment();
        }, 100);

        return () => {
            clearTimeout(handler);
        };

    }, [API_BASE_URL, editMode, profileData.Id_Departamento, profileData.Id_Ciudad, fetchDataFromApi, loadingCities, citiesError, cities.length]);

    // Effect para limpiar Id_Ciudad si la ciudad ya no pertenece al departamento seleccionado
    useEffect(() => {
        const currentDepartmentId = profileData.Id_Departamento;
        const currentCityId = profileData.Id_Ciudad;

        if (currentDepartmentId && currentCityId && cities.length > 0 && currentCityId !== '') {
            const cityExistsInCurrentDepartment = cities.some(city => String(city.Id_Ciudad) === String(currentCityId));

            // Si la ciudad seleccionada NO existe en la lista de ciudades del departamento actual, limpiar Id_Ciudad
            if (!cityExistsInCurrentDepartment) {
                setProfileData(prev => ({ ...prev, Id_Ciudad: '', Nombre_Ciudad: '' }));
            }
        }
    }, [profileData.Id_Departamento, profileData.Id_Ciudad, cities]);


    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true);
        setProfileMessage({ type: '', text: '' });

        const updatedFields = {};

        // Lista explícita de campos que pueden ser actualizados
        const updatableKeys = [
            'Nombres', 'Apellidos', 'Telefono', 'Direccion', 'Fecha_Nacimiento',
            'Correo_Electronico', 'Id_Ciudad' // Id_Departamento NO se envía
        ];

        // Iterar sobre los campos que SÍ queremos enviar
        for (const key of updatableKeys) {
            const oldValue = initialProfileData[key] !== undefined ? String(initialProfileData[key] || '') : '';
            const currentValue = String(profileData[key] || '');

            // Si el valor actual es diferente del valor inicial, agrégalo a updatedFields
            if (currentValue !== oldValue) {
                updatedFields[key] = currentValue === '' ? null : currentValue;
            }
        }

        // Manejo específico para Id_Ciudad, asegurando que sea un número o null
        if (updatedFields.hasOwnProperty('Id_Ciudad') && updatedFields.Id_Ciudad !== null) {
            const parsedCityId = parseInt(updatedFields.Id_Ciudad, 10);
            if (!isNaN(parsedCityId) && parsedCityId > 0) {
                updatedFields.Id_Ciudad = parsedCityId;
            } else {
                updatedFields.Id_Ciudad = null; // Si no es un número válido, enviar null
            }
        }

        if (updatedFields.hasOwnProperty('Correo_Electronico')) {
            const oldEmail = initialProfileData.Correo_Electronico || '';
            const currentEmail = profileData.Correo_Electronico || '';
            if (currentEmail === oldEmail) {
                delete updatedFields.Correo_Electronico;
            }
        }

        if (Object.keys(updatedFields).length === 0) {
            setProfileMessage({ type: 'info', text: 'No hay cambios para guardar.' });
            setLoadingUpdate(false);
            setEditMode(false);
            return;
        }

        console.log("Campos a enviar para actualizar:", updatedFields); // Para depuración

        try {
            // El Id_Usuario se obtiene del token JWT en el backend (req.user.id)
            const payload = {
                ...updatedFields
            };

            const response = await fetch(`${API_BASE_URL}/api/usuarios/profile`, {
                method: 'PATCH', // Usamos PATCH para actualizaciones parciales
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    logout(); // Forzar logout si el token no es válido o ha expirado
                    setProfileMessage({ type: 'error', text: 'Sesión expirada. Por favor, inicia sesión de nuevo.' });
                    return;
                }
                // Si hay un error, el backend debe enviar un mensaje en 'message' o 'error'
                throw new Error(data.message || data.error || 'Error al actualizar el perfil.');
            }

            setProfileMessage({ type: 'success', text: data.message || 'Perfil actualizado exitosamente.' });
            setEditMode(false);

            // Si el backend devuelve los datos de usuario actualizados, úsalos
            if (data.user) {
                updateUserContext(data.user);
                // También actualizamos initialProfileData para reflejar los nuevos datos y permitir futuras comparaciones correctas
                const updatedUser = {
                    ...data.user,
                    Id_Departamento: data.user.Id_Departamento ? String(data.user.Id_Departamento) : '',
                    Id_Ciudad: data.user.Id_Ciudad ? String(data.user.Id_Ciudad) : '',
                    Fecha_Nacimiento: data.user.Fecha_Nacimiento ? new Date(data.user.Fecha_Nacimiento).toISOString().split('T')[0] : '',
                };
                setProfileData(updatedUser);
                setInitialProfileData(updatedUser);
            } else {
                // Fallback: Si el backend no devuelve el user actualizado, actualizamos el estado local
                // y aseguramos que initialProfileData también se actualice
                const newProfileData = {
                    ...profileData,
                    ...updatedFields, // Aplicar los campos que SÍ se enviaron y actualizaron
                    // Para Nombre_Departamento y Nombre_Ciudad, necesitamos buscar el nombre si el ID cambió
                    Nombre_Departamento: updatedFields.Id_Departamento !== undefined ? (
                        departments.find(dep => String(dep.Id_Departamento) === String(updatedFields.Id_Departamento))?.Nombre_Departamento || ''
                    ) : profileData.Nombre_Departamento,
                    Nombre_Ciudad: updatedFields.Id_Ciudad !== undefined ? (
                        cities.find(city => String(city.Id_Ciudad) === String(updatedFields.Id_Ciudad))?.Nombre_Ciudad || ''
                    ) : profileData.Nombre_Ciudad,
                    // Asegurarse de que Correo_Electronico se actualice si fue enviado
                    Correo_Electronico: updatedFields.Correo_Electronico !== undefined ? updatedFields.Correo_Electronico : profileData.Correo_Electronico
                };
                setProfileData(newProfileData);
                setInitialProfileData(newProfileData); // Actualizar para futuras comparaciones
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setProfileMessage({ type: 'error', text: error.message || 'Error al actualizar el perfil.' });
        } finally {
            setLoadingUpdate(false);
        }
    };

    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoadingPasswordChange(true);
        setPasswordMessage({ type: '', text: '' });

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setPasswordMessage({ type: 'error', text: 'Todos los campos de contraseña son obligatorios.' });
            setLoadingPasswordChange(false);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setPasswordMessage({ type: 'error', text: 'La nueva contraseña y su confirmación no coinciden.' });
            setLoadingPasswordChange(false);
            return;
        }

        if (newPassword.length < 8) {
            setPasswordMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 8 caracteres.' });
            setLoadingPasswordChange(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios/change-password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    logout();
                    setPasswordMessage({ type: 'error', text: 'Sesión expirada. Por favor, inicia sesión de nuevo.' });
                    return;
                }
                throw new Error(data.message || 'Error al cambiar la contraseña.');
            }

            setPasswordMessage({ type: 'success', text: data.message || 'Contraseña actualizada exitosamente.' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordMessage({ type: 'error', text: error.message || 'Error al cambiar la contraseña.' });
        } finally {
            setLoadingPasswordChange(false);
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setProfileMessage({ type: '', text: '' });
        setProfileData(initialProfileData);
        loadedDepartmentIdRef.current = initialProfileData.Id_Departamento || null;
    };

    // Cierre de sesión
    const handleLogout = () => {
        logout(); // Llama a la función logout de tu contexto de autenticación
        navigate('/login'); // Redirige al usuario a la página de acceso después del logout
    };

    if (loadingProfile) {
        return <div className="profile-loading">Cargando perfil...</div>;
    }

    // Si hay un mensaje de error y no hay usuario (ej. logout por token expirado)
    if (profileMessage.type === 'error' && !user) {
        return <div className="profile-error">{profileMessage.text}</div>;
    }

    return (
        <div className="profile-container">
            <h1 className="profile-title">Mi Perfil</h1>

            {profileMessage.text && (
                <div className={`profile-message ${profileMessage.type}`}>
                    {profileMessage.text}
                </div>
            )}

            <div className="profile-section">
                <h2>Datos personales</h2>
                {!editMode ? (
                    <>
                        <div className="profile-details-display">
                            <div className="profile-details-item">
                                <img src={userIcon} alt="User" className="profile-icon" />
                                <p><strong>Nombres:</strong> {profileData.Nombres}</p>
                            </div>
                            <div className="profile-details-item">
                                <img src={userIcon} alt="User" className="profile-icon" />
                                <p><strong>Apellidos:</strong> {profileData.Apellidos || 'No especificado'}</p>
                            </div>
                            <div className="profile-details-item">
                                <img src={emailIcon} alt="Email" className="profile-icon" />
                                <p><strong>Correo electrónico:</strong> {profileData.Correo_Electronico}</p>
                            </div>
                            <div className="profile-details-item">
                                <img src={phoneIcon} alt="Phone" className="profile-icon" />
                                <p><strong>Teléfono:</strong> {profileData.Telefono || 'No especificado'}</p>
                            </div>
                            <div className="profile-details-item">
                                <img src={addressIcon} alt="Address" className="profile-icon" />
                                <p><strong>Dirección:</strong> {profileData.Direccion || 'No especificado'}</p>
                            </div>
                            <div className="profile-details-item">
                                <img src={departmentIcon} alt="Department" className="profile-icon" />
                                <p><strong>Departamento:</strong> {profileData.Nombre_Departamento || 'No especificado'}</p>
                            </div>
                            <div className="profile-details-item">
                                <img src={cityIcon} alt="City" className="profile-icon" />
                                <p><strong>Ciudad:</strong> {profileData.Nombre_Ciudad || 'No especificado'}</p>
                            </div>
                            <div className="profile-details-item">
                                <img src={calendarIcon} alt="Calendar" className="profile-icon" />
                                <p><strong>Fecha de nacimiento:</strong> {profileData.Fecha_Nacimiento || 'No especificado'}</p>
                            </div>
                        </div>
                        <button className="profile-edit-button" onClick={() => setEditMode(true)}>Editar perfil</button>
                    </>
                ) : (
                    <form className="profile-edit-form" onSubmit={handleProfileSubmit}>
                        <div className="profile-input-group">
                            <img src={userIcon} alt="User" className="profile-input-icon" />
                            <input
                                type="text"
                                name="Nombres"
                                placeholder="Nombres"
                                value={profileData.Nombres}
                                onChange={handleProfileChange}
                                required
                            />
                        </div>
                        <div className="profile-input-group">
                            <img src={userIcon} alt="User" className="profile-input-icon" />
                            <input
                                type="text"
                                name="Apellidos"
                                placeholder="Apellidos"
                                value={profileData.Apellidos}
                                onChange={handleProfileChange}
                            />
                        </div>
                        <div className="profile-input-group">
                            <img src={emailIcon} alt="Email" className="profile-input-icon" />
                            <input
                                type="email"
                                name="Correo_Electronico"
                                placeholder="Correo Electrónico"
                                value={profileData.Correo_Electronico}
                                onChange={handleProfileChange}
                                required
                            />
                        </div>
                        <div className="profile-input-group">
                            <img src={phoneIcon} alt="Phone" className="profile-input-icon" />
                            <input
                                type="tel"
                                name="Telefono"
                                placeholder="Teléfono"
                                value={profileData.Telefono}
                                onChange={handleProfileChange}
                                maxLength="10"
                            />
                        </div>
                        <div className="profile-input-group">
                            <img src={addressIcon} alt="Address" className="profile-input-icon" />
                            <input
                                type="text"
                                name="Direccion"
                                placeholder="Dirección"
                                value={profileData.Direccion}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className="profile-input-group">
                            <img src={departmentIcon} alt="Department" className="profile-input-icon" />
                            <select
                                name="Id_Departamento"
                                value={profileData.Id_Departamento}
                                onChange={handleProfileChange}
                                disabled={loadingDepartments}
                            >
                                <option value="">
                                    {loadingDepartments ? 'Cargando departamentos...' : (departmentsError ? `Error: ${departmentsError}` : 'Selecciona un Departamento')}
                                </option>
                                {departments.length > 0 && departments.map((dep) => (
                                    <option key={dep.Id_Departamento} value={dep.Id_Departamento}>
                                        {dep.Nombre_Departamento}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="profile-input-group">
                            <img src={cityIcon} alt="City" className="profile-input-icon" />
                            <select
                                name="Id_Ciudad"
                                value={profileData.Id_Ciudad}
                                onChange={handleProfileChange}
                                disabled={loadingCities || !profileData.Id_Departamento}
                            >
                                <option value="">
                                    {!profileData.Id_Departamento ? 'Primero selecciona un departamento' : (loadingCities ? 'Cargando ciudades...' : (citiesError ? `Error: ${citiesError}` : 'Selecciona tu Ciudad'))}
                                </option>
                                {cities.length > 0 && cities.map((city) => (
                                    <option key={city.Id_Ciudad} value={city.Id_Ciudad}>
                                        {city.Nombre_Ciudad}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="profile-input-group">
                            <img src={calendarIcon} alt="Calendar" className="profile-input-icon" />
                            <input
                                type="date"
                                name="Fecha_Nacimiento"
                                placeholder="Fecha de Nacimiento"
                                value={profileData.Fecha_Nacimiento}
                                onChange={handleProfileChange}
                            />
                        </div>
                        <div className="profile-actions">
                            <button type="submit" className="profile-submit-button" disabled={loadingUpdate}>
                                {loadingUpdate ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                            <button type="button" className="profile-cancel-button" onClick={handleCancelEdit} disabled={loadingUpdate}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="profile-section">
                <h2>Cambiar contraseña</h2>
                {passwordMessage.text && (
                    <div className={`profile-message ${passwordMessage.type}`}>
                        {passwordMessage.text}
                    </div>
                )}
                <form className="profile-password-form" onSubmit={handleChangePasswordSubmit}>
                    <div className="profile-input-group">
                        <img src={padlockIcon} alt="Padlock" className="profile-input-icon" />
                        <input
                            type="password"
                            name="currentPassword"
                            placeholder="Contraseña actual"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="profile-input-group">
                        <img src={padlockIcon} alt="Padlock" className="profile-input-icon" />
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="profile-input-group">
                        <img src={padlockIcon} alt="Padlock" className="profile-input-icon" />
                        <input
                            type="password"
                            name="confirmNewPassword"
                            placeholder="Confirmar nueva contraseña"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="profile-submit-button" disabled={loadingPasswordChange}>
                        {loadingPasswordChange ? 'Cambiando...' : 'Cambiar contraseña'}
                    </button>
                </form>
            </div>

            {/* Cerrar Sesión */}
            <div className="profile-section logout-section">
                <h3 className="logout-title">Gestión de sesión</h3>
                <p className="logout-info">
                    Al cerrar tu sesión, desconectarás tu cuenta de este dispositivo.
                    Para mayor seguridad, te recomendamos cerrar sesión en dispositivos compartidos.
                </p>
                <button className="profile-logout-button" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;