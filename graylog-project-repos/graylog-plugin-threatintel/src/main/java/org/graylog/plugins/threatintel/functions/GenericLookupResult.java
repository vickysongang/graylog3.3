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
package org.graylog.plugins.threatintel.functions;

import com.google.common.collect.ForwardingMap;
import com.google.common.collect.ImmutableMap;

import java.util.Map;

public class GenericLookupResult extends ForwardingMap<String, Object> {

    public static final String RESULTS_KEY = "threat_indicated";

    private final ImmutableMap<String, Object> results;

    public static final GenericLookupResult FALSE = new FalseGenericLookupResult();
    public static final GenericLookupResult TRUE = new TrueGenericLookupResult();

    private GenericLookupResult(ImmutableMap<String, Object> fields) {
        this.results = fields;
    }

    public Map<String, Object> getResults() {
        return results;
    }

    public boolean isMatch() {
        return ((boolean) getResults().get(RESULTS_KEY));
    }

    @Override
    protected Map<String, Object> delegate() {
        return getResults();
    }

    private static class FalseGenericLookupResult extends GenericLookupResult {
        private static final ImmutableMap<String, Object> FALSE = ImmutableMap.<String, Object>builder()
                .put(RESULTS_KEY, false)
                .build();

        private FalseGenericLookupResult() {
            super(FALSE);
        }
    }

    private static class TrueGenericLookupResult extends GenericLookupResult {
        private static final ImmutableMap<String, Object> TRUE = ImmutableMap.<String, Object>builder()
                .put(RESULTS_KEY, true)
                .build();

        private TrueGenericLookupResult() {
            super(TRUE);
        }
    }

}
