package org.graylog.plugins.monitor.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.auto.value.AutoValue;
import com.google.common.base.Strings;

import javax.annotation.Nullable;
import java.util.Optional;

@AutoValue
@JsonAutoDetect
public abstract class MonitorPluginConfigurationUpdate {

    abstract String kongLogTypes();

    @JsonCreator
    public static MonitorPluginConfigurationUpdate create(
            @JsonProperty("kongLogTypes") String kongLogTypes
    ) {
        return new AutoValue_MonitorPluginConfigurationUpdate(kongLogTypes);
    }
}
