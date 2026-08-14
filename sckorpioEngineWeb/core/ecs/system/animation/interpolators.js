function scalarLerp(a, b, alpha) {

    return a + (b - a) * alpha;
}


function vec2Lerp(a, b, alpha) {

    const result = vec2.create();

    vec2.lerp(
        result,
        a,
        b,
        alpha
    );

    return result;
}


function vec3Lerp(a, b, alpha) {

    const result = vec3.create();

    vec3.lerp(
        result,
        a,
        b,
        alpha
    );

    return result;
}


function vec4Lerp(a, b, alpha) {

    const result = vec4.create();

    vec4.lerp(
        result,
        a,
        b,
        alpha
    );

    return result;
}


export {
    scalarLerp,
    vec2Lerp,
    vec3Lerp,
    vec4Lerp
};