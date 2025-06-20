export const getTimeUnit = (value: number):string => {
    if(value < 60) return `1분 이내`;

    if(value < 60 * 60) {
        return `${Math.floor(value/60)} 분`;
    }

    return `${Math.floor(value/3600)} 시간 ${Math.floor((value%3600)/60)}분`;
}
/* eslint-disable */