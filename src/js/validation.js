import { showModal } from "../components/common/modal";

export function validateForm(fields) {
    let isValid = true;
    const errors = [];

    fields.forEach(({ selector, name, value, customCheck }) => {
        const $field = $(selector);
        
        if (customCheck) {
            const customError = customCheck(value, $field);
            if (customError) {
                $field.addClass("error");
                errors.push(customError);
                isValid = false;
            } else {
                $field.removeClass("error");
            }
        } else if (!value || value.trim() === '') {
            $field.addClass("error");
            errors.push(`Поле "${name}" обязательно для заполнения`);
            isValid = false;
        } else {
            $field.removeClass("error");
        }
    });

    if (!isValid) {
        showModal({
            title: 'Ошибка заполнения',
            content: errors.join('<br>'),
            type: 'error'
        });
    }

    return isValid;
} 