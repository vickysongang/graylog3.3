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
package org.graylog.plugins.threatintel.whois.ip;

import com.google.common.base.Strings;
import com.google.common.collect.ForwardingMap;

import java.util.HashMap;
import java.util.Map;

public class WhoisIpLookupResult extends ForwardingMap<String, Object> {

    private static final String NA = "N/A";

    private static WhoisIpLookupResult EMPTY = new WhoisIpLookupResult(NA, NA);

    private final String organization;
    private final String countryCode;

    private String prefix;

    WhoisIpLookupResult(String organization, String countryCode) {
        this.organization = organization;
        this.countryCode = countryCode;
    }

    static WhoisIpLookupResult empty() {
        return EMPTY;
    }

    public String getOrganization() {
        if(Strings.isNullOrEmpty(organization)) {
            return NA;
        } else {
            return organization;
        }
    }

    public String getCountryCode() {
        if(Strings.isNullOrEmpty(countryCode)) {
            return NA;
        } else {
            return countryCode;
        }
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public Map<String, Object> getResults() {
        final StringBuilder keyOrg = new StringBuilder();
        final StringBuilder keyCountryCode = new StringBuilder();

        if(prefix != null && !prefix.isEmpty()) {
            keyOrg.append(prefix).append("_");
            keyCountryCode.append(prefix).append("_");
        }

        keyOrg.append("whois_organization");
        keyCountryCode.append("whois_country_code");

        return new HashMap<String, Object>(){{
            put(keyOrg.toString(), getOrganization());
            put(keyCountryCode.toString(), getCountryCode());
        }};
    }

    @Override
    protected Map<String, Object> delegate() {
        return getResults();
    }

}
