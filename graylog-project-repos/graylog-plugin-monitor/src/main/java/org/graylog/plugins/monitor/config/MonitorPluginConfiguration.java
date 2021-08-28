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

    @JsonProperty("timeout_condition")
    public abstract String timeoutCondition();

    @JsonProperty("error_condition")
    public abstract String errorCondition();

    @JsonCreator
    public static MonitorPluginConfiguration create(@JsonProperty("kong_log_types") String kongLogTypes,
                                                    @JsonProperty("timeout_condition") String timeoutCondition,
                                                    @JsonProperty("error_condition") String errorCondition) {
        return builder()
                .kongLogTypes(kongLogTypes)
                .timeoutCondition(timeoutCondition)
                .errorCondition(errorCondition)
                .build();
    }

    public static MonitorPluginConfiguration createDefault() {
        return builder()
                .kongLogTypes("")
                .timeoutCondition("")
                .errorCondition("")
                .build();
    }

    static Builder builder() {
        return new AutoValue_MonitorPluginConfiguration.Builder();
    }

    public abstract Builder toBuilder();

    @AutoValue.Builder
    public static abstract class Builder {

        public abstract Builder kongLogTypes(String kongLogTypes);

        public abstract Builder timeoutCondition(String timeoutCondition);

        public abstract Builder errorCondition(String errorCondition);

        public abstract MonitorPluginConfiguration build();
    }

}
