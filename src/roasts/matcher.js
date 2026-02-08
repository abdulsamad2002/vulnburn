export function matchRoast(roasts, issueId) {
    const match = roasts.find(r => r.id === issueId);
    if (match) {
        return match.roast;
    }
    return "You messed up, but I can't even describe how bad it is.";
}
