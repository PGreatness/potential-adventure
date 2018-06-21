public class KeyCheck {
    private Key crypt;

    public KeyCheck(Key set) {
        crypt = set;
    }

    public boolean checkKey() {
        if (crypt.getPassword() == null) {
            System.out.println("Password for current crypt is not set. Please set the password");
            return false;
        }
        if (crypt.getAltPassword() == null) {
            System.out.println("Alternate password for crypt is not set. Please set the alternate password");
            return false;
        }
        return true;
    }
    public boolean isMatch(String guess) {
        if (crypt.getPassword().equals(guess)) {
            return true;
        }else{
            crypt.switchPasswords();
            return false;
        }
    }
    public String toString() {
        String tmp = "Current password: ";
        for (int i = 0; i < crypt.getPassword().length(); i++) {
            tmp += "*";
        }
        tmp += "\nAlternate Password: ";
        for (int i = 0; i < crypt.getAltPassword().length(); i++) {
            tmp += "*";
        }
        return tmp;
    }
}