import './spinner.css';

export function showSpinner() {
    // Удаляем существующий спиннер, если он есть
    hideSpinner();
    
    // Создаем элементы спиннера
    const overlay = document.createElement('div');
    overlay.className = 'spinner-overlay';
    overlay.id = 'global-spinner';
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    
    // Добавляем спиннер в оверлей
    overlay.appendChild(spinner);
    
    // Добавляем оверлей в body
    document.body.appendChild(overlay);
}

export function hideSpinner() {
    const existingSpinner = document.getElementById('global-spinner');
    if (existingSpinner) {
        existingSpinner.remove();
    }
} 