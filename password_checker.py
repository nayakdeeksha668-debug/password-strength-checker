
import string

# Common passwords that should be avoided
COMMON_PASSWORDS = [
    "password",
    "123456",
    "12345678",
    "qwerty",
    "admin",
    "password123"
]


def check_password(password):

    score = 0
    feedback = []

    # Check 1: Password length
    length_ok = len(password) >= 8

    # Check 2: Uppercase letters
    uppercase_ok = any(c.isupper() for c in password)

    # Check 3: Lowercase letters
    lowercase_ok = any(c.islower() for c in password)

    # Check 4: Numbers
    number_ok = any(c.isdigit() for c in password)

    # Check 5: Special characters
    special_ok = any(c in string.punctuation for c in password)

    # Calculate score
    checks = {
        "length": length_ok,
        "uppercase": uppercase_ok,
        "lowercase": lowercase_ok,
        "number": number_ok,
        "special": special_ok
    }

    score = sum(checks.values()) * 20

    # Give suggestions
    if not length_ok:
        feedback.append("Use at least 8 characters.")

    if not uppercase_ok:
        feedback.append("Add uppercase letters.")

    if not lowercase_ok:
        feedback.append("Add lowercase letters.")

    if not number_ok:
        feedback.append("Add numbers.")

    if not special_ok:
        feedback.append("Add special characters.")

    # Detect common passwords
    if password.lower() in COMMON_PASSWORDS:
        score = 0
        feedback.append("Avoid common passwords.")

    # Detect repeated characters
    if len(password) >= 3 and len(set(password)) == 1:
        score = 0
        feedback.append("Avoid repeating the same character.")

    # Detect predictable sequences
    sequences = ["123456", "abcdef", "qwerty"]

    if any(seq in password.lower() for seq in sequences):
        score = max(0, score - 20)
        feedback.append("Avoid predictable sequences.")

    # Determine strength
    if score < 40:
        strength = "Weak"
    elif score < 60:
        strength = "Medium"
    elif score < 80:
        strength = "Good"
    else:
        strength = "Strong"

    # Return results
    return {
        "score": score,
        "strength": strength,
        "checks": checks,
        "feedback": feedback
    }
