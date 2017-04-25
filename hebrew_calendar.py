LEAP_YEARS = [2, 5, 7, 10, 13, 16, 18]
HALAKIM_IN_HOUR = 1080
FIRST_MOLAD = (2, 5, 204)  # (days, hours, halakim)
BETWEEN_MOLAD = (29, 12, 793)  # (days, hours, halakim)

TISHREI = 7
CHESHVAN = 8
KISLEV = 9
TEVET = 10
SHEVAT = 11
ADAR_I = 12
ADAR_II = 13
NISAN = 1
IYAR = 2
SIVAN = 3
TAMUZ = 4
AV = 5
ELUL = 6

FULL_MONTH = [7, 11, 1, 3, 5]
MISSING_MONTH = [10, 13, 2, 4, 6]


def get_length_month(month, status_year, year_is_pregnant):
    if month in FULL_MONTH:
        return 30
    if month in MISSING_MONTH:
        return 29
    if year_is_pregnant:
        if month == ADAR_I:
            return 30
        if month == ADAR_II:
            return 29
    elif month == ADAR_I:
        return 29
    if month == KISLEV or month == CHESHVAN:
        if status_year == -1:
            return 29
        elif status_year == 1:
            return 30
        elif status_year == 0:
            if month is KISLEV:
                return 30
            return 29


def metonic_year(year):
    return (year - 1) % 19


def is_pregnant(year):
    return metonic_year(year) in LEAP_YEARS


def cnt_pregnant_years_in_lest_cycle(year):
    my = metonic_year(year)
    for k, v in enumerate(LEAP_YEARS):
        if k == len(LEAP_YEARS) - 1:
            return k
        if my <= v and my < LEAP_YEARS[k + 1]:
            return k


def cnt_pregnant_years_ever(year):
    return (year - 1) // 19 * 7 + cnt_pregnant_years_in_lest_cycle(year)


def cnt_new_moon_ever(year):
    return (year - 1) * 12 + cnt_pregnant_years_ever(year)


def date_of_new_cycle(year):
    new_moon_ever = cnt_new_moon_ever(year)
    halakim = divmod(new_moon_ever * 793 + 204, 1080)
    hours = divmod(halakim[0] + (new_moon_ever * 12 + 5), 24)
    days = divmod(hours[0] + (new_moon_ever * 29 + 2), 7)
    return days[1], hours[1], halakim[1]


def date_of_new_year(year):
    new_moon = date_of_new_cycle(year)
    if new_moon[1] >= 18:
        tmp = (new_moon[0] + 1, new_moon[1], new_moon[2])
        new_moon = tmp
    if new_moon[0] in [1, 4, 6]:
        tmp = (new_moon[0] + 1, new_moon[1], new_moon[2])
        new_moon = tmp
    return new_moon


def status_years(year):
    missing = (len(MISSING_MONTH) + 1) * 29
    full = (len(FULL_MONTH) + 1) * 30 + (30 if is_pregnant(year) else 0)
    day_next_year = date_of_new_year(year + 1)[0]
    day_year = date_of_new_year(year)[0]
    return day_next_year - (missing + full + day_year) % 7


def get_months_list(year_is_pregnant):
    result = [i for i in range(7, 13)]
    if year_is_pregnant:
        result.append(13)
    for i in range(1, 7):
        result.append(i)
    return result


def get_months_of_year(year):
    status_year = status_years(year)
    year_is_pregnant = is_pregnant(year)
    length_month = get_length_month(7, status_year=status_year, year_is_pregnant=year_is_pregnant)
    day_start_month = date_of_new_year(year)[0]
    result = [(length_month, day_start_month)]
    for k, month in enumerate(get_months_list(year_is_pregnant)[1:]):
        length_month = get_length_month(month, status_year=status_year, year_is_pregnant=year_is_pregnant)
        day_start_month = (result[k][0] + result[k][1]) % 7
        result.append((length_month, day_start_month))
    return result
