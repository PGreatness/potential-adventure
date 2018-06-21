import java.io.InputStreamReader;
import java.io.BufferedReader;

public class Driver {
    public InputStreamReader isr;
    public BufferedReader in;
    private Key user;
    private KeyCheck checkUser;
    public String guess;

    public Driver(Key encKey) {
        user = encKey;
        checkUser = new KeyCheck(user);    
        isr = new InputStreamReader( System.in );
        in = new BufferedReader( isr );
        guess = "";
    }

    public boolean matchKey(String guess) {
        return checkUser.isMatch(guess);
    }

    public boolean setGuess() {
        System.out.print("\nSubmit password: ");
        try {
            guess = in.readLine();
        }catch(Exception e) { }
        if (matchKey(guess)) {
            System.out.println("Welcome user");
            return true;
        }else{
            System.out.println("Password incorrect. Switching password...");
            guess = "";
            return false;
        }
    }

    public static void main(String[] args) {
        Key testKey = new Key("first", "secondStringisMuchLarger");
        Driver test = new Driver(testKey);
        while (!test.guess.equals(test.user.getPassword())) {
            System.out.println(test.checkUser);
            test.setGuess();
        }
    }
}