export const getTimeUnit = (value: number):string => {
    if(value < 60) return `${value} 초`;

    if(value < 60 * 60) {
        return `${Math.floor(value/60)} 분 ${value%60} 초`
    }

    return `${Math.floor(value/3600)} 시간 ${Math.floor((value%3600)/60)}분 ${(value%3600)%60} 초`
}