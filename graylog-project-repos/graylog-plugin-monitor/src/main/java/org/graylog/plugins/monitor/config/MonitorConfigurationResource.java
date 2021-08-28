package org.graylog.plugins.monitor.config;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.graylog2.audit.AuditEventTypes;
import org.graylog2.audit.jersey.AuditEvent;
import org.graylog2.plugin.cluster.ClusterConfigService;
import org.graylog2.plugin.rest.PluginRestResource;
import org.graylog2.shared.rest.resources.RestResource;
import org.graylog2.shared.security.RestPermissions;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Api(value = "Monitor/Config", description = "Manage Monitor Config settings")
@Path("/config")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class MonitorConfigurationResource extends RestResource implements PluginRestResource {
    private final ClusterConfigService clusterConfigService;

    @Inject
    public MonitorConfigurationResource(ClusterConfigService clusterConfigService) {
        this.clusterConfigService = clusterConfigService;
    }

    @PUT
    @ApiOperation(value = "Updates the Monitor default configuration.")
    @RequiresPermissions({RestPermissions.CLUSTER_CONFIG_ENTRY_CREATE, RestPermissions.CLUSTER_CONFIG_ENTRY_EDIT})
    @AuditEvent(type = AuditEventTypes.CLUSTER_CONFIGURATION_UPDATE)
    public Response updateConfig(@Valid MonitorPluginConfigurationUpdate update) {
        final MonitorPluginConfiguration existingConfiguration = clusterConfigService.getOrDefault(
                MonitorPluginConfiguration.class,
                MonitorPluginConfiguration.createDefault()
        );
        final MonitorPluginConfiguration.Builder newConfigBuilder = existingConfiguration.toBuilder()
                .kongLogTypes(update.kongLogTypes())
                .timeoutCondition(update.timeoutCondition())
                .errorCondition(update.errorCondition());
        final MonitorPluginConfiguration newConfiguration = newConfigBuilder.build();
        clusterConfigService.write(newConfiguration);
        return Response.accepted(newConfiguration).build();
    }

    @GET
    @Path("/get")
    @RequiresPermissions(RestPermissions.CLUSTER_CONFIG_ENTRY_READ)
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation(value = "get monitor configuration")
    public MonitorPluginConfiguration getMonitorConfiguration() {
        MonitorPluginConfiguration config = clusterConfigService.get(MonitorPluginConfiguration.class);
        return config;
    }
}
