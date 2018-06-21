public class Key {
    private String password;
    private String passwordAlt;

    public Key(String first, String second) {
        password = first;
        if (first.equals(second)) {
            throw new IllegalArgumentException("The two passwords cannot be the same");
        }
        passwordAlt = second;
    }

    public String getPassword() {
        return password;
    }
    public String getAltPassword() {
        return passwordAlt;
    }

    public boolean switchPasswords() {
        String tmp = password;
        password = passwordAlt;
        passwordAlt = tmp;
        return true;
    }
    
}