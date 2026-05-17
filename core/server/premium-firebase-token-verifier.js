async function verifyPremiumFirebaseIdentityToken(idToken, firebaseConfig) {
    const token = String(idToken || "").trim();
    const apiKey = String(firebaseConfig?.apiKey || "").trim();
    const projectId = String(firebaseConfig?.projectId || "").trim();

    if (!token) {
        throw new Error("Missing Firebase identity token.");
    }
    if (!apiKey) {
        throw new Error("Premium Firebase API key is not configured.");
    }

    const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({ idToken: token })
        }
    );

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        const remoteMessage = String(payload?.error?.message || "").trim();
        if (remoteMessage === "INVALID_ID_TOKEN") {
            throw new Error("The premium session token was invalid or expired.");
        }
        if (remoteMessage === "USER_DISABLED") {
            throw new Error("This premium Firebase account has been disabled.");
        }
        throw new Error(remoteMessage || `Premium token verification failed with status ${response.status}.`);
    }

    const user = Array.isArray(payload?.users) ? payload.users[0] : null;
    const uid = String(user?.localId || "").trim();
    if (!uid) {
        throw new Error("Firebase did not return a usable premium member identity.");
    }

    const provider =
        Array.isArray(user?.providerUserInfo) && user.providerUserInfo.some((entry) => entry?.providerId === "google.com")
            ? "google"
            : (Array.isArray(user?.providerUserInfo) && user.providerUserInfo.some((entry) => entry?.providerId === "password")
                ? "password"
                : "firebase");

    return {
        uid,
        email: String(user?.email || "").trim(),
        displayName: String(user?.displayName || "").trim(),
        photoURL: String(user?.photoUrl || user?.photoURL || "").trim(),
        provider,
        projectId
    };
}

module.exports = {
    verifyPremiumFirebaseIdentityToken
};
