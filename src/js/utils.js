import { showSpinner, hideSpinner } from '../components/common/spinner';

export async function handleFormSubmit({ 
    formData, 
    apiUrl, 
    onSuccess, 
    onError = (err) => {
        console.error("Ошибка запроса:", err);
        alert("Произошла ошибка при отправке данных");
    }
}) {
    try {
        showSpinner();
        
        const response = await fetch(apiUrl, {
            method: "POST",
            body: formData,
        });
        
        const result = await response.json();
        
        if (result.success) {
            onSuccess(result);
        } else {
            onError(new Error(result.error_text || "Неизвестная ошибка"));
        }
    } catch (err) {
        onError(err);
    } finally {
        hideSpinner();
    }
} 