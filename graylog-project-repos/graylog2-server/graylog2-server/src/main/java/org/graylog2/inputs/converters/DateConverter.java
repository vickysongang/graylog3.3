/**
 * This file is part of Graylog.
 *
 * Graylog is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Graylog is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Graylog.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.graylog2.inputs.converters;

import org.graylog2.ConfigurationException;
import org.joda.time.DateTime;
import org.joda.time.YearMonth;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Nullable;
import java.util.Locale;
import java.util.Map;

import static com.google.common.base.Strings.isNullOrEmpty;

public class DateConverter extends AbstractDateConverter {
    private static final Logger LOG = LoggerFactory.getLogger(DateConverter.class);
    private static final Locale DEFAULT_LOCALE = Locale.ENGLISH;

    private final String dateFormat;
    private final Locale locale;
    private final boolean containsTimeZone;

    public DateConverter(Map<String, Object> config) throws ConfigurationException {
        super(Type.DATE, config);

        if (config.get("date_format") == null || ((String) config.get("date_format")).isEmpty()) {
            throw new ConfigurationException("Missing config [date_format].");
        }

        this.dateFormat = ((String) config.get("date_format")).trim();
        this.locale = buildLocale(config.get("locale"));
        this.containsTimeZone = dateFormat.contains("Z") || dateFormat.contains("z");
    }

    private static Locale buildLocale(Object languageTag) {
        if (languageTag instanceof String) {
            try {
                return Locale.forLanguageTag((String) languageTag);
            } catch (IllegalArgumentException e) {
                return DEFAULT_LOCALE;
            }
        } else {
            return DEFAULT_LOCALE;
        }
    }

    @Override
    @Nullable
    public Object convert(@Nullable String value) {
        if (isNullOrEmpty(value)) {
            return null;
        }

        LOG.debug("Trying to parse date <{}> with pattern <{}>, locale <{}>, and timezone <{}>.", value, dateFormat, locale, timeZone);
        final DateTimeFormatter formatter;
        if (containsTimeZone) {
            formatter = DateTimeFormat
                    .forPattern(dateFormat)
                    .withDefaultYear(YearMonth.now(timeZone).getYear())
                    .withLocale(locale);
        } else {
            formatter = DateTimeFormat
                    .forPattern(dateFormat)
                    .withDefaultYear(YearMonth.now(timeZone).getYear())
                    .withLocale(locale)
                    .withZone(timeZone);
        }

        return DateTime.parse(value, formatter);
    }
}
