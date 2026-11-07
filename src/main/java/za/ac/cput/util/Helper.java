package za.ac.cput.util;

import org.apache.commons.validator.routines.EmailValidator;

/*
 * Helper.java
 * Helper class
 * Author: Ebenezer Kouakou (230480152)
 * Date: 10 June 2026
 */
public class Helper {
    public static boolean isEmptyOrNull(String str) {
        if (str == null || str.isBlank()) {
            return true;
        }
        return false;
    }

    public static boolean isValidEmail(String email) {
        EmailValidator emailValidator = EmailValidator.getInstance();
        if (emailValidator.isValid(email)) {
            return true;
        }
        return false;
    }
}
