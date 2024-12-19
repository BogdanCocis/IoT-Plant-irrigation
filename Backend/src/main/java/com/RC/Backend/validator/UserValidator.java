package com.RC.Backend.validator;

import com.RC.Backend.dto.RegisterDTO;
import com.RC.Backend.exception.InvalidDataException;

import java.util.regex.Pattern;

public class UserValidator {
    private static final String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
    private static final String nameRegex = "^([a-zA-Z]+)(( |-)([a-zA-Z])+){0,2}$";

    private static Boolean containsLowercaseLetter(String input) {
        for (char character : input.toCharArray()) {
            if (Character.isLowerCase(character)) {
                return true;
            }
        }
        return false;
    }

    private static Boolean containsUppercaseLetter(String input) {
        for (char character : input.toCharArray()) {
            if (Character.isUpperCase(character)) {
                return true;
            }
        }
        return false;
    }

    private static Boolean containsDigit(String input) {
        for (char character : input.toCharArray()) {
            if (Character.isDigit(character)) {
                return true;
            }
        }
        return false;
    }

    public static void validateEmail(String email) throws InvalidDataException {
        if (email.isEmpty()) {
            throw new InvalidDataException("Empty email!");
        }

        Pattern pattern = Pattern.compile(emailRegex);
        if (!pattern.matcher(email).matches()) {
            throw new InvalidDataException("Invalid email format!");
        }
    }

    public static void validatePassword(String password) throws InvalidDataException {
        if (password.length() < 8 || password.length() > 12) {
            throw new InvalidDataException("Password should have between 8 and 12 characters!");
        }

        if (!containsLowercaseLetter(password)) {
            throw new InvalidDataException("Password must contain at least a lower case letter!");
        }

        if (!containsUppercaseLetter(password)) {
            throw new InvalidDataException("Password must contain at least an upper case letter!");
        }

        if (!containsDigit(password)) {
            throw new InvalidDataException("Password must contain at least one digit!");
        }
    }

    public static void validateName(String name) throws InvalidDataException {
        if (name.isEmpty()) {
            throw new InvalidDataException("Empty name!");
        }

        Pattern pattern = Pattern.compile(nameRegex);
        if (!pattern.matcher(name).matches()) {
            throw new InvalidDataException("Invalid name format!");
        }
    }

    public static void validateRegister(RegisterDTO registerDTO) throws InvalidDataException {
        UserValidator.validateEmail(registerDTO.getEmail());
        UserValidator.validatePassword(registerDTO.getPassword());
        UserValidator.validateName(registerDTO.getName());
    }
}