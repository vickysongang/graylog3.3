package org.graylog.plugins.monitor.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.auto.value.AutoValue;

@JsonAutoDetect
@AutoValue
public abstract class MonitorPluginConfiguration {

    @JsonProperty("kong_log_types")
    public abstract String kongLogTypes();


    @JsonCreator
    public static MonitorPluginConfiguration create(@JsonProperty("kong_log_types") String kongLogTypes) {
        return builder()
                .kongLogTypes(kongLogTypes)
                .build();
    }

    public static MonitorPluginConfiguration createDefault() {
        return builder()
                .kongLogTypes("")
                .build();
    }

    static Builder builder() {
        return new AutoValue_MonitorPluginConfiguration.Builder();
    }

    public abstract Builder toBuilder();

    @AutoValue.Builder
    public static abstract class Builder {

        public abstract Builder kongLogTypes(String kongLogTypes);

        public abstract MonitorPluginConfiguration build();
    }

}
